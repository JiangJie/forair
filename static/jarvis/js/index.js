require(['jquery', 'user', 'share', 'top', 'isotope', 'imagesloaded', 'jinja', 'bootstrap'], function($, user) {
  var cgi = {
    more: {url: '/product/more', method: 'GET'},
    like: {url: '/product/like', method: 'PUT'}
  };
  var start = 0,
    limit = 15;
  var hasNext = true;
  var alLike = 'allike';

  $(document).ready(function() {

    $(document).delegate('article .like', 'click', function() {
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
        console.error(err);
      });
    });

    var $wallcontent = $('#wallcontent');

    $wallcontent.isotope({
      itemSelector : 'article'
    });

    var loadProducts = function() {
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
            var template = '{% for product in products %}<article><div class="details"><h6 class="product-title" title="{{ product.title }}">{{ product.title }}</h6></div><a href="{{ product.url }}" target="_blank" class="linkc"><img src="{{ product.pic }}" alt="{{ product.title }}"></a><button{% if product.alLike %} class="like ' + alLike + '" title="已收藏" {% else %} class="like" title="收藏" {% endif %}value="{{ product._id }}"></button></article>{% endfor %}',
              context = {products: res.products};
            var content = Jinja.render(template, context);
            content = $(content);
            $wallcontent.append(content);
            $wallcontent.imagesLoaded(function() {
              $wallcontent.isotope('appended', content).isotope('reLayout');
            });
          } else {
            hasNext = false;
          }
        }
      }, function(err) {
        console.error(err);
      });
    };
    loadProducts();
    var isBottom = function() {
      return $(document).scrollTop() + $(window).height() == $(document).height();
    };
    $(window).scroll(function () {
      if(isBottom() && hasNext) {
        loadProducts();
      }
    });
  });
});