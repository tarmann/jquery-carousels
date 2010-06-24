/*
 * Elastic Carousel (for jQuery)
 * version: 1.0 (23/10/2009)
 * @requires jQuery v1.4.2 or later
 *
 */

(function(){
  $.fn.eCarousel = function(params){
    return $(this).each(function(){
			
			
			var pre = "jec";
			
      // create outer div and wrapper
			var $itemList = $(this),
          $carousel = $('<div><div class="' + pre + '-wrapper"></div></div>')
                        .attr("class", $itemList.attr("class"))
                        .attr("id", $itemList.attr("id"))
                        .insertAfter($itemList);

      var $wrapper = $('> div', $carousel),
          $slider = $("<div>").attr("class", pre + "-slider").appendTo( $wrapper ).append( $itemList.clone().attr("class", "") ),
          $items = $slider.find('ul > li'),
          $single = $items.filter(':first')
					
					singleWidth = $single.outerWidth(true);
					itemsTotal = $slider.find("li").size();
			
					clones = 16;
			
			$slider.width("9999");

      // remove original list
			$itemList.remove();
			
			// clone head and tail
			$items.filter(':first').before($items.slice(- clones).clone().addClass('cloned'));
      $items.filter(':last').after($items.slice(0, clones).clone().addClass('cloned'));
      $items = $slider.find('> li'); // reselect
			
			// remove last item margin
			if($single.css("margin-right")){
				margin = $single.css("margin-right");
				margin = margin.substring(0, margin.length-2);
			}
			
			// slider width
			$slider.width( singleWidth * $slider.find("li").size() - margin + 1 );

			// 3. Set the left position to the first 'real' item
			$wrapper.scrollLeft(singleWidth * clones);
			
			updatePages();
			$slider.find("li:last").addClass(pre + "-last");

			function updatePages(){
				// count max slides
				visible = Math.round($wrapper.width() /  singleWidth);
				pages = Math.round(($slider.width() - $wrapper.width()) / singleWidth);
				currentPage = Math.round( $wrapper.scrollLeft() / singleWidth );
				
				// remove arrows and duplicates
				if(pages + 1 <= 0){ 
					$carousel.find("." + pre + "-arrows").hide();
					$carousel.find(".cloned").hide();
				}
				else {
					$carousel.find("." + pre + "-arrows").show();
					$carousel.find(".cloned").show();
				}
			}
			
      // paging function
      function gotoPage(page) {
          var dir = page < currentPage ? -1 : 1,
              n = Math.abs(currentPage - page),
              left = singleWidth * dir * n;
							left = (page * singleWidth )
					
					$wrapper.filter(':not(:animated)').animate({
              scrollLeft : left
          }, 400, function () {
							if(currentPage <= (clones - visible)) $wrapper.scrollLeft(singleWidth * (currentPage + itemsTotal - 1));
							
							
							
							if(currentPage == (clones + itemsTotal)) $wrapper.scrollLeft( singleWidth * (clones + 1));
							updatePages(page);
          });
					
          return false;
      }
			
      // add navigation arrows
      $wrapper.after('<div class="' + pre + '-arrows">'
				+ '<a class="' + pre + '-arrow ' + pre + '-back"><</a>'
				+ '<a class="' + pre + '-arrow ' + pre + '-forward">></a></div>');

      window.gotoPage = gotoPage;

      // bind to the forward and back buttons
      $('a.' + pre + '-back', $carousel).click(function () {
					return gotoPage(currentPage - 1);
      });
      
      $('a.' + pre + '-forward', $carousel).click(function () {
          return gotoPage(currentPage + 1);
      });
			
      // bind to the resize window
			$(window).resize(function() {
				updatePages();
				
				currentPos = $slider.width() - ($wrapper.scrollLeft() + $wrapper.width());
				if(currentPos < 0){
					$('.' + pre + '-wrapper').scrollLeft( $('.' + pre + '-slider').width() );
				}
			});			
      
      // create a public interface to move to a specific page
      $(this).bind('goto', function (event, page) {
					gotoPage(page);
      });
    });
  };
})(jQuery);