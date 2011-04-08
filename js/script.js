/* Author: Jake Lear*/


//Adds connection element for Raphael (From http://raphaeljs.com/graffle.html)
Raphael.fn.connection = function(obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{
            x: bb1.x + bb1.width / 2,
            y: bb1.y - 1
        }, {
            x: bb1.x + bb1.width / 2,
            y: bb1.y + bb1.height + 1
        }, {
            x: bb1.x - 1,
            y: bb1.y + bb1.height / 2
        }, {
            x: bb1.x + bb1.width + 1,
            y: bb1.y + bb1.height / 2
        }, {
            x: bb2.x + bb2.width / 2,
            y: bb2.y - 1
        }, {
            x: bb2.x + bb2.width / 2,
            y: bb2.y + bb2.height + 1
        }, {
            x: bb2.x - 1,
            y: bb2.y + bb2.height / 2
        }, {
            x: bb2.x + bb2.width + 1,
            y: bb2.y + bb2.height / 2
        }],
        d = {},
        dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({
            path: path
        });
        line.line.attr({
            path: path
        });
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({
                stroke: bg.split("|")[0],
                fill: "none",
                "stroke-width": bg.split("|")[1] || 3
            }),
            line: this.path(path).attr({
                stroke: color,
                fill: "none"
            }),
            from: obj1,
            to: obj2
        };
    }
};



//Radiation Visualization - Global Constructor
function radVis(){
	//Basic Properties
	this.scrolled = 0;
	this.currentconnection = 3;
	this.levels = 4;
	
	//cache some elements
    this.$window = $(window),
    this.$document = $(document);
		
	//Setup Raphael Canvas and initial elements
	this.r = new Raphael("homepage-vis");
	this.connections = [];
	this.bubbles = [this.r.circle(130, 130, 2000000000),this.r.circle(130, 130, 2000000),this.r.circle(130, 130, 2000),this.r.circle(130, 130, 100)];
	this.unitConnector = this.r.circle(296, 70, 1).attr({fill:"#fff", stroke:"#FFF"}); //Unit connector is a small circle that hides underneath the text which serves as a start point for the connectors
	this.bubbles[0].attr({fill: "#FFDC62", stroke: "#FFDC62"});
	this.bubbles[1].attr({fill: "#89DAFA", stroke: "#89DAFA"});
	this.bubbles[2].attr({fill: "#C2CC1E", stroke: "#C2CC1E"});
	this.bubbles[3].attr({fill: "#D91895", stroke: "#D91895"});

	this.connections[0] = this.r.connection(this.bubbles[0], this.unitConnector, "#fff", "#fff");
	this.connections[1] = this.r.connection(this.bubbles[1], this.unitConnector, "#fff", "#fff");
	this.connections[2] = this.r.connection(this.bubbles[2], this.unitConnector, "#fff", "#fff");	
	this.connections[3] = this.r.connection(this.bubbles[3], this.unitConnector, "#fff", "#fff");


}

radVis.prototype.rngMinMax = function(min, max){ //returns random number between min and max
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

radVis.prototype.getScrollScale = function(scroll){
	//Establishes the scale exponentially based on the number of levels.
    var scale = Math.pow(1/65, scroll * (this.levels)); 
    return scale;
};

radVis.prototype.scrollZoom = function(){ //This is triggered on scroll
	// normalize scroll value from 0 to 1
    scrolled = this.$window.scrollTop() / (this.$document.height() - this.$window.height());
    this.transformScroll(scrolled);
};

radVis.prototype.transformScroll = function(scroll){ 
		this.links = [];
		for (var i = 0; i<this.bubbles.length; i+=1){
			this.bubbles[i].scale(this.getScrollScale(scroll),this.getScrollScale(scroll));
			this.links[i] = this.r.connection(this.connections[i]);
			//console.log(scroll);
		}		
			
		this.$unitTitle = $('#unit-representation');
		this.$unitText = this.$unitTitle.html();
		
			if (scroll < 0.155 && this.$unitText != '0.05 &mu;Sv'){
				this.$unitTitle.html('0.05 &mu;Sv'); 
				
			} else if (scroll > 0.155 && scroll < 0.547 && this.$unitText != '1 &mu;Sv'){
				this.$unitTitle.html('1 &mu;Sv');
				
			} else if (scroll > 0.547 && scroll < 0.942 && this.$unitText != '1 mSv') {
				this.$unitTitle.html('1 mSv');
			} else if (scroll > 0.942 && this.$unitText != '1 Sv'){
				this.$unitTitle.html('1 Sv');
			}
};



var mainVis = new radVis();

$(function() {
	//RADS.initViz();
    $(window).scroll(function() {
        mainVis.scrollZoom();
		
    });
});
	

	















