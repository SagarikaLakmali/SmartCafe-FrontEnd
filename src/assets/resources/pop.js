$(document).ready(function(){

	var scroll = false;
	var launcherMaxHeight = 346;
	var launcherMinHeight = 296;
	
	// Mousewheel event handler to detect whether user has scrolled over the container
   
	
	// Scroll event to detect that scrollbar reached top of the container
	
	
	// Click event handler to toggle dropdown
	$('.app-launcher').hide();
	$(".button").click(function(event){
	  event.stopPropagation();
	  $(".app-launcher").toggle();
	});
	
	$(document).click(function() {
	  //Hide the launcher if visible
	  $('.app-launcher').hide();
	  });
	  
	  // Prevent hiding on click inside app launcher
	  $('.app-launcher').click(function(event){
		  event.stopPropagation();
	  });

});

// Resize event handler to maintain the max-height of the app launcher
$(window).resize(function(){
	  $('.apps').css({maxHeight: $(window).height() - $('.apps').offset().top});
});