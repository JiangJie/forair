require([
  'jquery',
  '/jarvis/js/jquery-plugin/jquery.jribbble.min.js',
  '/jarvis/js/jquery-plugin/jquery.isotope.min.js',
  '/jarvis/js/jquery-plugin/jquery.imagesloaded.min.js',
  'bootstrap'
], function($) {
  $(document).ready(function(){
    var $wallcontent=$('#wallcontent'), pagenum=1, $showmore = $('#showmore');

    $wallcontent.isotope({
      itemSelector : 'article'
    });

    $showmore.bind('click', loadshots);

    function loadshots(){
      $showmore.unbind('click');
      $(this).text('加载中...');

      $.jribbble.getShotsByList("popular", function(data){

        var items = [];

        $.each(data.shots, function (i, shot) {
          items.push('<article>');
          items.push('<div class="details"><h2>' + shot.title + '</h2></div>');
          items.push('<a href="' + shot.url + '" target="_blank" class="linkc">');
          items.push('<img src="' + shot.image_teaser_url + '" alt="' + shot.title + '">');
          items.push('</a>');
          items.push('<div class="author">设计师：<a href="' + shot.player.url + '">' + shot.player.name + '</a></div></article>');
        });

        var newEls = items.join('');

        var testcontent = $(newEls);
        $wallcontent.append(testcontent);
        $wallcontent.imagesLoaded(function(){
          $wallcontent.isotope('appended', testcontent).isotope('reLayout');
          $showmore.text('更多设计 (More)...').bind('click', loadshots);
        });

      },
      {page: pagenum, per_page: 10});

      pagenum++;

    }

    $showmore.trigger('click');

  });

  /* ---------------------------------------------------------------------- */
  /*  back to up
  /* ---------------------------------------------------------------------- */
  $(function(){
    $('body').append('<div id="backtotop" class="showme"><div class="bttbg"></div></div>');
    initGoToTop();
  });

  function initGoToTop() {
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
});