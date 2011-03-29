// Radiation Dose Chart 
// by Jake Lear

var RADIATION = {
	
	getScrollStyles: function(scroll){
		//Set up scale 
		var scale = Math.pow( 1/21,  scroll * 3 ),
	      	prop = 'scale(' + scale + ')',
			scrolled = 0,
	      	style = {
	        	WebkitTransform : prop,
	        	MozTransform : prop,
	       		OTransform : prop,
	        	transform : prop
	      	};
 		return style;
	},
	
	scrollZoom: function(){
		//cache some elements
		var $content = $('#content'),
	  		$title = $('#title'),
	  		$nav = $('#nav'),
			$body = $('body'),
			$window = $(window),
			$document = $(document);
			
		// normalize scroll value from 0 to 1
		scrolled = $window.scrollTop() / ($document.height() - $window.height() );
		transformScroll(scrolled);
		
		function transformScroll(scroll){
			$content.css( RADIATION.getScrollStyles( scroll ) );
		}

	}	
	
}

$(function(){
	$(window).scroll(function() {
	        RADIATION.scrollZoom();
	 });
});








