require([
  'jquery',
  '/jarvis/js/jquery-plugin/jquery.isotope.min.js',
  '/jarvis/js/jquery-plugin/jquery.imagesloaded.min.js',
  'bootstrap'
], function($) {
  var cgi = {
    more: {url: '/product/more', method: 'GET'}
  };

  $(document).ready(function() {
    var $wallcontent = $('#wallcontent'),
      $showmore = $('#showmore'),
      pagenum=1;

    $wallcontent.isotope({
      itemSelector : 'article'
    });

    var loadProducts = function() {
      $showmore.unbind('click');
      $(this).text('加载中...');

      $.ajax({
        url: cgi.more.url,
        type: cgi.more.method
      }).then(function(res) {
        if(res.recode === 0) {
          var items = [];
          $.each(res.products, function(i, shot) {
            items.push('<article>');
            items.push('<div class="details"><h2 title="' + shot.name + '">' + shot.name + '</h2></div>');
            items.push('<a href="' + shot.url + '" target="_blank" class="linkc">');
            items.push('<img src="' + shot.img + '" alt="' + shot.name + '">');
            items.push('</a></article>');
          });

          var newEls = items.join('');

          var testcontent = $(newEls);
          $wallcontent.append(testcontent);
          $wallcontent.imagesLoaded(function() {
            $wallcontent.isotope('appended', testcontent).isotope('reLayout');
            $showmore.text('更多爱犬用品 (More)...').bind('click', loadProducts);
          });
        } else {
          $showmore.text('更多爱犬用品 (More)...').bind('click', loadProducts);
        }
      }, function(err) {
        $showmore.text('更多爱犬用品 (More)...').bind('click', loadProducts);
        console.log(err);
      });
      pagenum++;
    }
    $showmore.bind('click', loadProducts);
    $showmore.trigger('click');

  });

  /* ---------------------------------------------------------------------- */
  /*  back to up
  /* ---------------------------------------------------------------------- */

  var initGoToTop = function() {
    var orig_scroll_height = $('footer').position().top - $(window).height() - 200;

    // fade in #top_button
    $(function () {
      $(window).scroll(function () {
        //console.log($(this).scrollTop());
        if ($(this).scrollTop() > 100) {
          $('#backtotop').addClass('showme');
        } else {
          $('#backtotop').removeClass('showme');
        }
      });

      // scroll body to 0px on click
      $('#backtotop').click(function () {
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
  }
  $(function(){
    $('body').append('<div id="backtotop" class="showme"><div class="bttbg"></div></div>');
    initGoToTop();
  });
});