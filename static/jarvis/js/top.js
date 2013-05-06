require(['jquery'], function($) {
  /* ---------------------------------------------------------------------- */
  /*  back to up
  /* ---------------------------------------------------------------------- */

  var initGoToTop = function() {
    var orig_scroll_height = $('footer').position().top - $(window).height() - 200;

    // fade in #top_button
    $(function () {
      $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
          $('#backtotop').addClass('showme');
        } else {
          $('#backtotop').removeClass('showme');
        }
      });

      // scroll body to 0px on click
      $(document).delegate('#backtotop', 'click', function () {
        $('body,html').animate({
          scrollTop: 0
        },  400);
        return false;
      });
    });

    if ($(window).scrollTop() == 0) {
      $('#backtotop').removeClass('showme');
    }else{
      $('#backtotop').addClass('showme');
    }
  };
  $(function(){
    $('body').append('<div id="backtotop" class="showme"><div class="bttbg"></div></div>');
    initGoToTop();
  });
});