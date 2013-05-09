define(['jquery', 'bootstrap'], function($) {
  var cgi = {
    share: {url: '/product/share', method: 'GET'},
    add: {url: '/product/add', method: 'POST'}
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
          var template = '<form id="addForm"><input type="hidden" name="numid" value="{{ numid }}"/><input type="hidden" name="url" value="{{ url }}"/><input type="hidden" name="brand" value="{{ brand }}"/><input type="hidden" name="title" value="{{ title }}"/><input type="hidden" name="pic" value="{{ pic }}"/><input type="hidden" name="price" value="{{ price }}"/><div class="share-pic clearfix"><img src="{{ pic }}"></div><div class="share-content clearfix"><p><span>¥{{ price }}</span><span title="{{ title }}">{{ title }}</span></p><div><p><span id="alreadyShare" class="hide">已经分享过了哦~<a href="javascript:void(0);" id="switchShare">换一个分享</a></span><span class="float-right">还可以输入<span id="pubLeft">140</span>个字</span></p><div><textarea id="pubContent" name="twitter" placeholder="说点什么吧~" required="required"></textarea><button type="submit" class="pub-button">发表</button></div></div></div></form>',
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