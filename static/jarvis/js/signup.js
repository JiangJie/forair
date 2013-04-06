require(['jquery', 'bootstrap'], function($) {
  // if(document.getElementById('signupPassword').value.trim() != document.getElementById('signupRePassword').value.trim()) {
  // }

  // $('#signinModal').on('show', function(e) {
  //   $('#signinEmail').attr('value', '');
  //   $('#signinPassword').attr('value', '');
  // });


  $('#signupEmail').change(function() {
    $('#emailExist').addClass('hide');
    var self = this;
    if(self.value.trim()) {
      $.ajax({
        url: '/user/exist',
        dataType: 'json',
        data: {uid: self.value},
        success: function(res) {
          console.log(res);
          if(res.recode === 0) {
            if(res.isExist) return $('#emailExist').removeClass('hide');
            return $('#emailNotExist').removeClass('hide');
          }
        },
        error: function(res) {
          console.log(res);
        }
      });
    }
  });
});