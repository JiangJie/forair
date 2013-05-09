define(['jquery'], function($) {
  var cgi = {
    like: {url: '/product/like', method: 'PUT'}
  };
  var alLike = 'al-like';

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
  });
});