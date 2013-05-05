require(['jquery', 'isotope', 'imagesloaded', 'jinja', 'bootstrap'], function($) {
  var cgi = {
    more: {url: '/product/more', method: 'GET'},
    like: {url: '/product/like', method: 'PUT'},
    share: {url: '/product/share', method: 'GET'},
    add: {url: '/product/add', method: 'POST'}
  };
  var start = 0,
    limit = 15;
  var hasNext = true;
  var alLike = 'allike';
  var twitter = 140;

  $(document).ready(function() {
    var oldContent = $('div.modal-body').html();
    $(document).delegate('#switchShare', 'click', function() {
      $('div.modal-body').html(oldContent);
    });
    $(document).delegate('#pubContent', 'keyup', function() {
      var $pubLeft = $('#pubLeft');
      if(parseInt($pubLeft.html(), 10) > 0) {
        $pubLeft.html(Math.max(twitter - $(this).val().trim().length, 0));
        if($pubLeft.html() == '0') {
          $pubLeft.addClass('red');
        }
      }
    });
    $(document).delegate('#addForm', 'submit', function(e) {
      var self = this;
      e.preventDefault();
      $.ajax({
        url: cgi.add.url,
        type: cgi.add.method,
        data: $(self).serialize()
      }).then(function(res) {
        if(res.recode == 0) {
          if(res.success) {
            $('#signinModal').modal('hide');
            $('div.modal-body').html(oldContent);
          } else {
            if(res.msg == 'already share') {
              $('#alreadyShare').removeClass('hide');
            }
          }
        }
      }, function(err) {
        console.error(err);
      });
    });
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
    }

    loadProducts();
    var loadShare = function(e) {
      var self = this;
      e.preventDefault();
      $.ajax({
        url: cgi.share.url,
        type: cgi.share.method,
        data: $(self).serialize(),
        dataType: 'json'
      }).then(function(res) {
        if(res.recode == 0) {
          var template = '<form id="addForm"><input type="hidden" name="numid" value="{{ numid }}"/><input type="hidden" name="url" value="{{ url }}"/><input type="hidden" name="brand" value="{{ brand }}"/><input type="hidden" name="title" value="{{ title }}"/><input type="hidden" name="pic" value="{{ pic }}"/><input type="hidden" name="price" value="{{ price }}"/><div class="share-pic clearfix"><img src="{{ pic }}"></div><div class="share-content clearfix"><p><span>¥{{ price }}</span><span title="{{ title }}">{{ title }}</span></p><div><p><span id="alreadyShare" class="hide">已经分享过了哦~<a href="javascript:void(0);" id="switchShare">换一个分享</a></span><span class="float-right">还可以输入<span id="pubLeft">140</span>个字</span></p><div><textarea id="pubContent" name="twitter" placeholder="说点什么吧~" required="required"></textarea><button type="submit" class="pub-button">发表</button></div></div></div></form>',
            context = res.share;
          var content = Jinja.render(template, context);
          content = $(content);
          $('div.modal-body').html(content);
        }
      }, function(err) {
        console.error(err);
      });
    }

    $(document).delegate('#shareForm', 'click', loadShare);

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
  }
  $(function(){
    $('body').append('<div id="backtotop" class="showme"><div class="bttbg"></div></div>');
    initGoToTop();
  });
});