require(['jquery'], function($) {
  var cgi = {
    info: {url: '/user/info', method: 'GET'}
  }
  $(document).ready(function() {
    $.ajax({
      url: cgi.info.url,
      type: cgi.info.method
    }).then(function(res) {
      if(res.recode == 0 && res.info) return $('#nickname').html(res.info.nickname);
    }, function(err) {
      console.error(err);
    });
  });
});