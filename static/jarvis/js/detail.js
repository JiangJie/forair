require(['jquery', 'user', 'signin', 'like', 'share', 'jinja', 'bootstrap'], function($, user) {
  var cgi = {
    detail: {url: '/product/detail/', method: 'GET'}, // 获取产品详情
    comment: {url: '/comment/add/', method: 'POST'} // 添加评论
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
    $(document).delegate('#commentForm', 'submit', function(e) {
      var self = this;
      e.preventDefault();
      $.ajax({
        url: cgi.comment.url,
        type: cgi.comment.method,
        data: $(self).serialize()
      }).then(function(res) {
        if(res.recode == 0) {
          if(res.success) {
            var template = '<li><p><span class="comment-nick">{{ comment.nickname|default(comment.uid) }}</span><span class="comment-create">{{ comment.create }}</p><p>{{ comment.content }}</span></p></li>',
              context = {comment: res.comment};
            var content = Jinja.render(template, context);
            content = $(content);
            $('#commentList').append(content);
            $('#conmentTextarea').val('');
          }
        }
      }, function(err) {
        console.error(err);
      });
    });

    var loadProduct = function() {
      var pid = getUrlParameters['id'];
      $.ajax({
        url: cgi.detail.url + pid,
        type: cgi.detail.method
      }).then(function(res) {
        if(res.recode === 0) {
          var product = res.product;
          if(product) {
            $('#commentPid').val(product._id);
            // var template = '<p>由{{ product.nickname }}在{{ product.create|date("%Y-%m-%d %H:%M:%S") }}分享</p><img src="{{ product.pic }}"><div>评论区</div>',
            var template = '<p class="detail-title"><a href="{{ product.url }}">{{ product.title }}</a></p><p class="detail-info">由<span class="detail-nick">{{ product.nickname }}</span>在<span class="detail-create">{{ product.create }}</span>分享</p><p><span class="detail-twitter">分享心情：</span>{{ product.twitter }}</p><div><a href="{{ product.url }}" class="detail-pic-wrap"><img src="{{ product.pic }}"></a></div>',
              context = {product: product};
            var content = Jinja.render(template, context);
            content = $(content);
            $('#info').append(content);

            template = '{% for comment in product.comment %}<li><p><span class="comment-nick">{{ comment.nickname|default(comment.uid) }}</span><span class="comment-create">{{ comment.create }}</p><p>{{ comment.content }}</span></p></li>{% endfor %}';
            context = {product: product};
            content = Jinja.render(template, context);
            content = $(content);
            $('#commentList').append(content);
          }
        }
      }, function(err) {
        console.error(err);
      });
    };
    loadProduct();
  });
});