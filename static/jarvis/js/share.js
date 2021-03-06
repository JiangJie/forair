define(['jquery', 'bootstrap'], function($) {
  var cgi = {
    share: {url: '/product/share', method: 'GET'}, // 根据淘宝等链接获取产品信息
    add: {url: '/product/add', method: 'POST'} // 分享一件产品
  };
  var twitter = 140;
  $(document).ready(function() {
    var oldContent = $('#shareModal div.modal-body').html();
    $(document).delegate('#switchShare', 'click', function() {
      $('#shareModal div.modal-body').html(oldContent);
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
            $('#shareModal').modal('hide');
            $('#shareModal div.modal-body').html(oldContent);
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
          var template = '<form id="addForm"><input type="hidden" name="numid" value="{{ numid }}"/><input type="hidden" name="url" value="{{ url }}"/><input type="hidden" name="brand" value="{{ brand }}"/><input type="hidden" name="title" value="{{ title }}"/><input type="hidden" name="pic" value="{{ pic }}"/><input type="hidden" name="price" value="{{ price }}"/><div class="share-pic clearfix"><img src="{{ pic }}"></div><div class="share-content clearfix"><p><span>¥{{ price }}</span><span title="{{ title }}">{{ title }}</span></p><p><span>请选择分享的类别：</span><select name="type"><option value="1">狗粮</option><option value="2">狗窝</option><option value="3">狗链</option><option value="4">狗笼子</option><option value="5">狗零食</option><option value="6">狗狗衣服</option><option value="7">狗狗玩具</option><option value="8">狗狗营养品</option></select></p><div><p><span id="alreadyShare" class="hide">已经分享过了哦~<a href="javascript:void(0);" id="switchShare">换一个分享</a></span><span class="float-right">还可以输入<span id="pubLeft">140</span>个字</span></p><div class="twitter-wrap"><textarea id="pubContent" name="twitter" placeholder="说点什么吧~" required="required"></textarea><button type="submit" class="pub-button">发表</button></div></div></div></form>',
            context = res.share;
          var content = Jinja.render(template, context);
          content = $(content);
          $('#shareModal div.modal-body').html(content);
        }
      }, function(err) {
        console.error(err);
      });
    };

    $(document).delegate('#shareForm', 'submit', loadShare);

  });
});