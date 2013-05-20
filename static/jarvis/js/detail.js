require(['jquery', 'user', 'like', 'share', 'jinja', 'bootstrap'], function($, user, top) {
  var cgi = {
    detail: {url: '/product/detail/', method: 'GET'}
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

  $(document).ready(function() {
    var $wallcontent = $('#wallcontent');

    var loadProduct = function() {
      var pid = getUrlParameters['id'];
      $.ajax({
        url: cgi.detail.url + pid,
        type: cgi.detail.method
      }).then(function(res) {
        if(res.recode === 0) {
          var product = res.product;
          if(product) {
            var template = '<p>由{{ product.nickname }}在{{ product.create|date("Y-m-d") }}分享</p><img src="{{ product.pic }}"><div>评论区</div>',
              context = {product: product};
            var content = Jinja.render(template, context);
            content = $(content);
            $wallcontent.append(content);
          }
        }
      }, function(err) {
        console.error(err);
      });
    };
    loadProduct();
  });
});