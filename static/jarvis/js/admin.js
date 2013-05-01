require(['jquery', 'bootstrap'], function($) {
  var cgi = {
    addProduct: {url: '/admin/product/add', method: 'POST'}
  };

  $('#productAdd').on('click', function() {
    var self = this;
    var productName = $('#productName').val().trim(),
      productUrl = $('#productUrl').val().trim(),
      productImgUrl = $('#productImgUrl').val().trim();
    if(productName && productUrl && productImgUrl) {
      $(self).attr('disabled', 'disabled');
      $(self).html('添加中...');
      $.ajax({
        url: cgi.addProduct.url,
        type: cgi.addProduct.method,
        dataType: 'json',
        data: {product: {name: productName, url: productUrl, img: productImgUrl}}
      }).then(function(res) {
        if(res.recode === 0) {
          $('#productName').val('');
          $('#productUrl').val('');
          $('#productImgUrl').val('');
          if(res.success) {
            setTimeout(function() {
              $('#showSuccess').addClass('hide');
            }, 3000);
            return $('#showSuccess').removeClass('hide');
          }
        }
      }, function(res) {
        console.log(res);
      }).always(function() {
        $(self).removeAttr('disabled');
        $(self).html('添加');
        $('.controls img.preview').animate({
          height: 0
        }, 400);
      });
    }
  });

  $('#productImgPreview').on('click', function() {
    var previewImg = $('.controls img.preview');
    if(previewImg.css('height') == '0px') {
      previewImg.attr('src', $('#productImgUrl').val().trim()).animate({
        height: 300
      }, 400);
    }
  });
});