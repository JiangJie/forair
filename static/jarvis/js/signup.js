require(['jquery', 'signin', 'bootstrap'], function($) {
  var cgi = {
    uidExist: {url: '/user/exist/uid', method: 'GET'},
    emailExist: {url: '/user/exist/email', method: 'GET'},
    signup: {url: '/user/signup', method: 'POST'}
  };

  $(document).delegate('#signupUid', 'change', function() {
    $('#uidExist').addClass('hide');
    var self = this;
    if(self.value.trim()) {
      $.ajax({
        url: cgi.uidExist.url,
        type: cgi.uidExist.method,
        dataType: 'json',
        data: {uid: self.value.trim()}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.isExist) return $('#uidExist').removeClass('hide');
          return $('#uidNotExist').removeClass('hide');
        }
      }, function(res) {
        console.log(res);
      });
    }
  });
  $(document).delegate('#signupEmail', 'change', function() {
    $('#emailExist').addClass('hide');
    var self = this;
    if(self.value.trim()) {
      $.ajax({
        url: cgi.emailExist.url,
        type: cgi.emailExist.method,
        dataType: 'json',
        data: {email: self.value.trim()}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.isExist) return $('#emailExist').removeClass('hide');
          return $('#emailNotExist').removeClass('hide');
        }
      }, function(res) {
        console.log(res);
      });
    }
  });

  $(document).delegate('#signupForm', 'submit', function(e) {
    e.preventDefault();
    var uid = $('#signupUid').val().trim(),
      email = $('#signupEmail').val().trim(),
      pwd = $('#signupPassword').val().trim(),
      rePwd = $('#signupRePassword').val().trim(),
      nickname = $('#signupNickname').val().trim();
    if(uid && email && pwd && rePwd && nickname && (pwd === rePwd)) {
      $.ajax({
        url: cgi.signup.url,
        type: cgi.signup.method,
        dataType: 'json',
        data: {uid: uid, email: email, pwd: pwd, rePwd: rePwd, nickname: nickname}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.success) {
            $('#signupSuccessText').removeClass('hide');
            $('#uidExist').addClass('hide');
            $('#emailExist').addClass('hide');
          }
        }
      }, function(res) {
        console.log(res);
      });
    }
  });
});