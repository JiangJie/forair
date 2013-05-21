define(['jquery'], function($) {
  var cgi = {
    info: {url: '/user/info', method: 'GET'}
  };
  var getInfo = function(cb) {
    $.ajax({
      url: cgi.info.url,
      type: cgi.info.method
    }).then(function(res) {
      if(res.recode == 0 && res.info) return cb(res.info);
      return cb(null);
    }, function(err) {
      console.error(err);
    });
  };
  $(document).ready(function() {
    getInfo(function(user) {
      if(user) {
        $('#signinMenu').addClass('hide');
        $('#signupMenu').addClass('hide');
        $('#myMenu').removeClass('hide');
        $('#shareMenu').removeClass('hide');
        $('#cellectMenu').removeClass('hide');
        $('#nickname').html(user.nickname);
        $('#conmentTextarea').removeAttr('disabled');
        $('#conmentTextarea').removeAttr('title');
        $('#commentSubmit').removeAttr('disabled');
      }
    });
  });

  return {
    getInfo: getInfo
  }
});