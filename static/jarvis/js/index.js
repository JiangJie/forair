require(['jquery', 'user', 'top', 'signin', 'like', 'share', 'isotope', 'imagesloaded', 'jinja', 'bootstrap'], function($, user, top) {
  var cgi = {
    more: {url: '/product/more', method: 'GET'} // 获取产品列表
  };
  var getUrlParameters = (function(a) {
    if (a == '') return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
    return b;
  })(window.location.search.substr(1).split('&'));
  var start = 0,
    limit = 15;
  var hasNext = true;

  $(document).ready(function() {
    var $wallcontent = $('#wallcontent');

    $wallcontent.isotope({
      itemSelector : 'article'
    });

    var loadProducts = function() {
      var q = getUrlParameters['q'],
        t = getUrlParameters['t'];
      $($('.nav-wrap .nav-list li')[t - 1]).addClass('active');
      $.ajax({
        url: cgi.more.url,
        type: cgi.more.method,
        data: {start: start, limit: limit, q: q, t: t}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.products.length) {
            if(res.products.length < limit) {
              hasNext = false;
            }
            start = start + res.products.length;
            var template = '{% for product in products %}<article><div class="details"><h6 class="product-title" title="{{ product.title }}">{{ product.title }}</h6></div><a href="/detail.html?id={{ product._id }}" target="_blank" class="linkc"><img src="{{ product.pic }}" alt="{{ product.title }}"></a><span class="price">￥{{ product.price }}</span><button{% if product.alLike %} class="like al-like" title="已收藏" {% else %} class="like" title="收藏" {% endif %}value="{{ product._id }}"></button></article>{% endfor %}',
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
    $(window).scroll(function () {
      if(top.isBottom() && hasNext) {
        loadProducts();
      }
    });
  });
});