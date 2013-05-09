require(['jquery', 'user', 'top', 'like', 'share', 'isotope', 'imagesloaded', 'jinja', 'bootstrap'], function($, user, top) {
  var cgi = {
    more: {url: '/product/more/like', method: 'GET'}
  };
  var start = 0,
    limit = 15;
  var hasNext = true;

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
          if(res.products && res.products.length) {
            if(res.products.length < limit) {
              hasNext = false;
            }
            start = start + res.products.length;
            var template = '{% for product in products %}<article><div class="details"><h6 title="{{ product.title }}" class="product-title">{{ product.title }}</h6></div><a href="{{ product.url }}" target="_blank" class="linkc"><img src="{{ product.pic }}" alt="{{ product.title }}"></a><span class="price">￥{{ product.price }}</span><button class="like al-like" title="已收藏" value="{{ product._id }}"></button></article>{% endfor %}',
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
        console.log(err);
      });
    }

    loadProducts();

  });
});