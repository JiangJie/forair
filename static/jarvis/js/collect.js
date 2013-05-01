require([
  'jquery',
  '/jarvis/js/jquery-plugin/jquery.isotope.min.js',
  '/jarvis/js/jquery-plugin/jquery.imagesloaded.min.js',
  '/jarvis/js/jinja.min.js',
  'bootstrap'
], function($) {
  var cgi = {
    more: {url: '/product/more/like', method: 'GET'},
    like: {url: '/product/like', method: 'PUT'}
  };
  var start = 0,
    limit = 12;
  var hasNext = true;
  var alLike = 'allike';

  $(document).ready(function() {
    var $wallcontent = $('#wallcontent');

    $wallcontent.isotope({
      itemSelector : 'article'
    });

    loadProducts = function() {
      $.ajax({
        url: cgi.more.url,
        type: cgi.more.method,
        data: {start: start, limit: limit}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.products.length) {
            if(res.products.length < limit) {
              hasNext = false;
            }
            start = start + res.products.length;
            var template = '{% for product in products %}<article><div class="details"><h2 title="{{ product.name }}">{{ product.name }}</h2></div><a href="{{ product.url }}" target="_blank" class="linkc"><img src="{{ product.img }}" alt="{{ product.name }}"></a><button class="like allike" title="已收藏" value="{{ product._id }}"></button></article>{% endfor %}',
              context = {products: res.products};
            var content = Jinja.render(template, context);
            content = $(content);
            $wallcontent.append(content);
            $wallcontent.imagesLoaded(function() {
              $wallcontent.isotope('appended', content).isotope('reLayout');
            });
            $('article .like').on('click', function() {
              var self = this;
              var like = 1;
              if($(self).hasClass(alLike)) {
                like = 0;
              }
              $.ajax({
                url: cgi.like.url + '/' + this.value,
                type: cgi.like.method,
                data: {like: like}
              }).then(function(res) {
                if(res.recode === 0 && res.success) {
                  if(like) {
                    $(self).addClass(alLike);
                    $(self).attr('title', '已收藏');
                  } else {
                    $(self).removeClass(alLike);
                    $(self).attr('title', '收藏');
                  }
                }
              }, function(err) {
                console.log(err);
              });
            });
          } else {
            hasNext = false;
          }
        }
      }, function(err) {
        console.log(err);
      });
    }

    loadProducts();

  });

  var isBottom = function() {
    return $(document).scrollTop() + $(window).height() == $(document).height();
  }

  /* ---------------------------------------------------------------------- */
  /*  back to up
  /* ---------------------------------------------------------------------- */

  var initGoToTop = function() {
    var orig_scroll_height = $('footer').position().top - $(window).height() - 200;

    // fade in #top_button
    $(function () {
      $(window).scroll(function () {
        if(isBottom() && hasNext) {
          loadProducts();
        }
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