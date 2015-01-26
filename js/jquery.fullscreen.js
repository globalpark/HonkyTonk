/* 
	Author: http://codecanyon.net/user/sike
*/      

;(function($){ 

	// preload the big images
	function preload(arrayOfImages) {
	    $(arrayOfImages).each(function(index){
	        $('<img/>')[0].src = this;
	    });
	} 

	// open the link of the big image
	function openLink(event){                    
  		window.open(event.data.link, event.data.target);
 		event.stopPropagation();
	}  

	var currentImgNum = 0;
	var currentThumb, allImageNums, slideShowInt;  

	function openBigImage(_n, t){               
		clearInterval(slideShowInt); 				
		prevThumb = t.data('prevThumb');
		var thumbnailArr = t.data('thumbnailArr');
		var linkArr = t.data('linkArr'); 
		var targetArr = t.data('targetArr'); 
		var bigImageArr = t.data('bigImageArr');
		prevThumb.removeClass('active'); 	  
		currentThumb = thumbnailArr[_n].addClass('active');   
		t.data('prevThumb', currentThumb);		      		
	    $.backstretch(bigImageArr[_n], {speed: 500}, function(){ 
		
 			var _container = $("#backstretch");	
			if(linkArr[currentImgNum]){
				_container.css('cursor', 'pointer');
				_container.bind('click', {link:linkArr[_n], target:targetArr[_n]}, function(event) {
				  	openLink(event);
				});
			}else{
				_container.css('cursor', 'default');						
				_container.unbind('click');									
			} 	            		
		                             

			if(t.data('slideShow')&&!t.data('mouseover')){   
				clearInterval(slideShowInt);
	  		   	slideShowInt = setInterval(function(){
					nextBigImage(t);
				}, t.data('slideShowDelay'));  
			}
		});                                    		
		currentImgNum = _n;   	
	} 
	
	// display next image
	function nextBigImage(t){
		var _n = currentImgNum;
		_n++;
		if(_n>allImageNums-1) _n = 0;
		openBigImage(_n, t);   
	}
	
	
	$.fn.extend({                           
		fullscreenGallery: function(options) {
	      	// plugin default options, it's extendable
			var settings = { 
				containerClass: 'galleryContainer',
				thumbContainer: 'thumbContainer', 
				thumbParentContainer: 'thumbParentContainer',
				thumbNum: 12,                  
				thumbPadding: 0,    
				thumbAutoHide: false,
				easeInType: 'bounceInRight',
				slideShow: true,
				slideShowDelay: 4000
			}; 
			
  			// extends settings with options provided
	        if (options) {
				$.extend(settings, options);
			} 
			
			var _this = this;           
			var parent = _this.parent();   
			
  			var bigImages = _this.find('.bigImages');             			
			var thumbnails = _this.find('.thumbnails');             				
			allImageNums = bigImages.find('ul li').size();	   
			
			thumbnails.wrap('<div class="' + settings.thumbContainer + '"/>');  	 
			var thumbContainer = thumbnails.parent();                          
			thumbContainer.wrap('<div class="' + settings.thumbParentContainer + '"/>');  	 
			var thumbParentContainer = thumbContainer.parent();
			
			var bigImageArr = [];       
			var thumbnailArr = [];   
			var linkArr = [];   
			var targetArr = [];
			
			bigImages.find('li').each(function(index) {
				$(this).hide(); 
				bigImageArr[index] = $(this).find('img').attr('src');
				if($(this).find('a').size()>0){
					linkArr[index] = $(this).find('a').attr('href'); 
					targetArr[index] = $(this).find('a').attr('target')||"_self";
				}
			});                                                      
			               
			_this.data('bigImageArr', bigImageArr);			
			_this.data('linkArr', linkArr);
			_this.data('targetArr', targetArr);			
	  		_this.data('mouseover', false);  				
			preload(bigImageArr);
	  						
			$.backstretch(bigImageArr[0], {speed: 500}, function(){ 
				var _container = $("#backstretch");											
	 			if(linkArr[currentImgNum]){
					_container.css('cursor', 'pointer');
					_container.bind('click', {link:linkArr[currentImgNum], target:targetArr[currentImgNum]}, function(event) {
					  	openLink(event);
					});
				}	

				_container.mouseout(function(event) {   
					if(settings.thumbAutoHide)thumbParentContainer.stop().animate({opacity: 0}, 300);;
					_this.data('mouseover', false);			
					if(settings.slideShow){                  
						clearInterval(slideShowInt); 																				
			  		   	slideShowInt = setInterval(function(){
							nextBigImage(_this);
						}, _this.data('slideShowDelay')); 
					}     					
					
				});		
				
				_container.mouseover(function(event) {      
					if(settings.slideShow)clearInterval(slideShowInt); 		                        					
					thumbParentContainer.stop().animate({opacity: 1}, 300); 
					_this.data('mouseover', true);
				});
				
  				/* the auto delay slide show */
				if(settings.slideShow&&!_this.data('mouseover')) {
					slideShowInt = setInterval(function() {
						nextBigImage(_this);
					}, settings.slideShowDelay);
				}          

				_this.data("slideShow", settings.slideShow);			
				_this.data('slideShowDelay', settings.slideShowDelay);        						
				             				
			});  
			
			
			currentThumb = thumbnails.find('li').first().addClass('active');  
			_this.data("prevThumb", currentThumb);			      
			var thumbWidth, 
			thumbHeight,
			thumbPadding = settings.thumbPadding;  
		
			thumbnails.find('li').each(function(index) {
				$(this).attr('rel', index);   
				thumbnailArr[index] = $(this);
				if(index==0) {
					thumbWidth = $(this).outerWidth(true);
				  	thumbHeight = $(this).outerHeight(true) + 10;
				}
				$(this).css({
					cursor: 'pointer',
					position: 'absolute',
					left: (thumbWidth + thumbPadding)*index 
				});
				
				// $(this).addClass('bounceInUp' + ' animate'+index);                  										
				$(this).bind('click', function(e) {
					var _n = $(this).attr('rel');  
					_this.data("prevThumb", currentThumb);
					openBigImage(_n, _this);
					e.stopPropagation();
				});
			});           
			
			_this.data('thumbnailArr', thumbnailArr)
			
			thumbParentContainer.css({
				width: (thumbWidth + thumbPadding)*settings.thumbNum + 20*2 + 'px', 
				height: thumbHeight + 'px',                 
			  	left: '50%',
				marginLeft: -thumbWidth*settings.thumbNum/2 + 20 + 'px'
			})
			thumbContainer.css({
				width: (thumbWidth + thumbPadding)*settings.thumbNum + 'px', 
				height: thumbHeight + 'px',                 
				/*
			  	left: '50%',
				marginLeft: -thumbWidth*settings.thumbNum/2 + 'px',
				*/
				overflow: 'hidden'                                  
			})  
			
			thumbParentContainer.mouseover(function(event) {
				thumbParentContainer.stop().animate({opacity: 1}, 300);
			});  
			               
			var arrowButton = $('<div class="nextArrow"></div><div class="prevArrow"></div>');   			
			thumbParentContainer.append(arrowButton);     
			
			var nextBtn = $('.nextArrow', thumbParentContainer);     
			var prevBtn = $('.prevArrow', thumbParentContainer);   
			var currentDir = 0;
			var thumbConWidth = parseInt(thumbContainer.css('width'));    
			// prevBtn.stop().animate({opacity: 0}, 300); 
			nextBtn.click(function(event) {               
				var _dir = currentDir;
				_dir++;                                     
				var newX = -parseInt(thumbContainer.css('width'))*_dir;                                                 
				/*
				nextBtn.stop().animate({opacity: 1}, 300);  					
				prevBtn.stop().animate({opacity: 1}, 300); 
				nextBtn.css('cursor', 'pointer');									
				prevBtn.css('cursor', 'pointer');													 					
				var _nextDir = _dir;
				_nextDir++;                                 
				if(-parseInt(thumbContainer.css('width'))*_nextDir<thumbConWidth-(thumbWidth + thumbPadding)*allImageNums){
					nextBtn.stop().animate({opacity: 0}, 300);  					
					nextBtn.css('cursor', 'default')
				} 
				*/
                if(newX<thumbConWidth-(thumbWidth + thumbPadding)*allImageNums){
					newX = thumbConWidth-(thumbWidth + thumbPadding)*allImageNums;	
					_dir = Math.ceil((thumbWidth + thumbPadding)*allImageNums/thumbConWidth) - 1;
				}                 				
				currentDir = _dir;
				thumbnails.animate({left: newX + "px"}, 300);
			});         
			
			prevBtn.click(function(event) {
				var _dir = currentDir;
				_dir--;
				var newX = -parseInt(thumbContainer.css('width'))*_dir;
				/*
				nextBtn.stop().animate({opacity: 1}, 300);  					
				prevBtn.stop().animate({opacity: 1}, 300);  					
				nextBtn.css('cursor', 'pointer');									
				prevBtn.css('cursor', 'pointer');									
				var _nextDir = _dir;
				_nextDir--;                                 
				if(-parseInt(thumbContainer.css('width'))*_nextDir>0){
					prevBtn.stop().animate({opacity: 0}, 300);   					
					prevBtn.css('cursor', 'default');
				}
				*/
                if(newX > 0){
					newX = 0;
					_dir = 0;      
				} 				
				thumbnails.animate({left: newX + "px"}, 300);
				currentDir = _dir; 
			});
			
			            
			return this;
		}
		
	})  
	
	/*
	 * jQuery Backstretch
	 * Version 1.2.5
	 * http://srobbin.com/jquery-plugins/jquery-backstretch/
	 *
	 * Add a dynamically-resized background image to the page
	 *
	 * Copyright (c) 2011 Scott Robbin (srobbin.com)
	 * Dual licensed under the MIT and GPL licenses.
	*/ 	

    $.backstretch = function(src, options, callback) {
        var defaultSettings = {
            centeredX: true,         // Should we center the image on the X axis?
            centeredY: true,         // Should we center the image on the Y axis?
            speed: 0                 // fadeIn speed for background after image loads (e.g. "fast" or 500)
        },
        container = $("#backstretch"),
        settings = container.data("settings") || defaultSettings, // If this has been called once before, use the old settings as the default
        existingSettings = container.data('settings'),
        rootElement = ("onorientationchange" in window) ? $(document) : $(window), // hack to acccount for iOS position:fixed shortcomings
        imgRatio, bgImg, bgWidth, bgHeight, bgOffset, bgCSS;
                
        // Extend the settings with those the user has provided
        if(options && typeof options == "object") $.extend(settings, options);
        
        // Just in case the user passed in a function without options
        if(options && typeof options == "function") callback = options;
    
        // Initialize
        $(document).ready(_init);
  
        // For chaining
        return this;
    
        function _init() {
            // Prepend image, wrapped in a DIV, with some positioning and zIndex voodoo
            if(src) {
                var img;
                
                // If this is the first time that backstretch is being called
                if(container.length == 0) {
                    container = $("<div />").attr("id", "backstretch")
                                            .css({left: 0, top: 0, position: "fixed", overflow: "hidden", zIndex: -999999, margin: 0, padding: 0, height: "100%", width: "100%"});
                } else {
                    // Prepare to delete any old images
                    container.find("img").addClass("deleteable");
                }
                
                img = $("<img />").css({position: "absolute", display: "none", margin: 0, padding: 0, border: "none", zIndex: -999999})
                                  .bind("load", function(e) {                                          
                                      var self = $(this),
                                          imgWidth, imgHeight;
                                          
                                      self.css({width: "auto", height: "auto"});
                                      imgWidth = this.width || $(e.target).width();
                                      imgHeight = this.height || $(e.target).height();
                                      imgRatio = imgWidth / imgHeight;

                                      _adjustBG(function() {
                                          self.fadeIn(settings.speed, function(){
                                              // Remove the old images, if necessary.
                                              container.find('.deleteable').remove();
                                              // Callback
                                              if(typeof callback == "function") callback();
                                          });
                                      });
                                      
                                  })
                                  .appendTo(container);
                 
                // Append the container to the body, if it's not already there
                if($("body #backstretch").length == 0) {
                    $("body").append(container);
                }
                
                // Attach the settings
                container.data("settings", settings);
                    
                img.attr("src", src); // Hack for IE img onload event
                // Adjust the background size when the window is resized or orientation has changed (iOS)
                $(window).resize(_adjustBG);
            }
        }
            
        function _adjustBG(fn) {
            try {
                bgCSS = {left: 0, top: 0}
                bgWidth = rootElement.width();
                bgHeight = bgWidth / imgRatio;
                
                // Make adjustments based on image ratio
                // Note: Offset code provided by Peter Baker (http://ptrbkr.com/). Thanks, Peter!
                if(bgHeight >= rootElement.height()) {
                    bgOffset = (bgHeight - rootElement.height()) /2;
                    if(settings.centeredY) $.extend(bgCSS, {top: "-" + bgOffset + "px"});
                } else {
                    bgHeight = rootElement.height();
                    bgWidth = bgHeight * imgRatio;
                    bgOffset = (bgWidth - rootElement.width()) / 2;
                    if(settings.centeredX) $.extend(bgCSS, {left: "-" + bgOffset + "px"});
                }

                $("#backstretch, #backstretch img:not(.deleteable)").width( bgWidth ).height( bgHeight )
                                                   .filter("img").css(bgCSS);
            } catch(err) {
                // IE7 seems to trigger _adjustBG before the image is loaded.
                // This try/catch block is a hack to let it fail gracefully.
            }
      
            // Executed the passed in function, if necessary
            if (typeof fn == "function") fn();
        }
    };  	
		
})(jQuery);