require(['jquery', 'bootstrap'], function($) {
  var cgi = {
    userExist: {url: '/user/exist', method: 'GET'},
    signup: {url: '/user/signup', method: 'POST'}
  };
  // if(document.getElementById('signupPassword').value.trim() != document.getElementById('signupRePassword').value.trim()) {
  // }

  $('#signinModal').on('show', function(e) {
    $('#signinEmail').val('');
    $('#signinPassword').val('');
  });

  $('#signupEmail').on('change', function() {
    $('#emailExist').addClass('hide');
    var self = this;
    if(self.value.trim()) {
      $.ajax({
        url: cgi.userExist.url,
        type: cgi.userExist.method,
        dataType: 'json',
        data: {uid: self.value.trim()}
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

  $('#signupSubmit').on('click', function() {
    var uid = $('#signupEmail').val().trim(),
      pwd = $('#signupPassword').val().trim(),
      rePwd = $('#signupRePassword').val().trim(),
      nickname = $('#signupNickname').val().trim();
    if(uid && pwd && rePwd && nickname && (pwd === rePwd)) {
      $.ajax({
        url: cgi.signup.url,
        type: cgi.signup.method,
        dataType: 'json',
        data: {uid: uid, pwd: pwd, rePwd: rePwd, nickname: nickname}
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.success) return $('#signupSuccessText').removeClass('hide');
        }
      }, function(res) {
        console.log(res);
      });
    }
  });
});