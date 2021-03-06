/*
 * Carousel Panes (for jQuery)
 * version: 0.1 (23/10/2009)
 * @requires jQuery v1.3.2 or later
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2009 Bruno Tarmann [ contato@tarmann.com.br ]
 *
 */

(function(){
  $.fn.carouselPanes = function(params){
    return $(this).each(function(){
    
      // create outer div and wrapper
      var $itemList = $(this),
          $carousel = $('<div><div class="cp-wrapper"></div></div>')
                        .attr("class", $itemList.attr("class"))
                        .attr("id", $itemList.attr("id"))
                        .insertAfter($itemList);

      var $wrapper = $('> div', $carousel),
          $slider = $("<div>").attr("class","cp-slider").appendTo( $wrapper ),
          $items = $itemList.find('> li'),
          $single = $items.filter(':first'),
          
          // calculate based on item sizes
          paneWidth = $wrapper.innerWidth(),

          cols = params.cols,
          rows = params.rows,
          
          visible = rows * cols,
          pages = Math.ceil($items.length / visible),
          
          currentPage = 1;
  
      // create panes
      for(i = 1; i <= pages; i++){
        $slider.append('<div class="cp-pane"><ul></ul></div>');
        $slider.find('.cp-pane:last ul').html(
          $items.slice((i * visible) - visible, i * visible).clone()
        );                        
      }
      
      // remove original list
      $itemList.remove();

      // clone first and last item for the loop
      var $panes = $slider.find('> .cp-pane');
      $panes.filter(":last").after( $panes.filter(":first").clone().addClass("cp-cloned") );
      $panes.filter(":first").before( $panes.filter(":last").clone().addClass("cp-cloned") );

      // reset position
      $wrapper.scrollLeft(paneWidth);

      // paging function
      function gotoPage(page) {
          var dir = page < currentPage ? -1 : 1,
              n = Math.abs(currentPage - page),
              left = paneWidth * dir * n;
          
          $wrapper.filter(':not(:animated)').animate({
              scrollLeft : '+=' + left
          }, 500, function () {
            if (page == 0) {
                $wrapper.scrollLeft(paneWidth * pages);
                page = pages;
            } else if (page > pages) {
                $wrapper.scrollLeft(paneWidth);
                // reset back to start position
                page = 1;
            }

            currentPage = page;
          });
          return false;
      }
      
      // add navigation arrows
      $wrapper.after('<div class="cp-arrows"><a class="cp-arrow cp-back"><</a><a class="cp-arrow cp-forward">></a></div>')

      window.gotoPage = gotoPage;

      // bind to the forward and back buttons
      $('a.cp-back', $carousel).click(function () {
          return gotoPage(currentPage - 1);                
      });
      
      $('a.cp-forward', $carousel).click(function () {
          return gotoPage(currentPage + 1);
      });
      
      // create a public interface to move to a specific page
      $(this).bind('goto', function (event, page) {
          gotoPage(page);
      });
    });
  };
})(jQuery);