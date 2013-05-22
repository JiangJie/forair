require(['jquery', 'bootstrap'], function($) {
  var cgi = {
    signin: {url: '/user/signin', method: 'POST'}
  };

  $(document).delegate('#signinModal', 'show', function() {
    $('#signinUid').val('');
    $('#signinPassword').val('');
  });

  $(document).delegate('#signinUid, #signinPassword', 'focus', function() {
    $('#signinModal .modal-body #signinError').addClass('hide');
  });

  $(document).delegate('#signinForm', 'submit', function(e) {
    e.preventDefault();
    var self = this;
    var uid = $('#signinUid').val().trim(),
      pwd = $('#signinPassword').val().trim();
    if(uid && pwd) {
      $.ajax({
        url: cgi.signin.url,
        type: cgi.signin.method,
        data: $(self).serialize()
      }).then(function(res) {
        if(res.recode === 0) {
          if(res.success) return window.location.reload();
          $('#signinModal .modal-body #signinError').removeClass('hide');
        }
      }, function(res) {
        console.log(res);
      });
    }
  });
});