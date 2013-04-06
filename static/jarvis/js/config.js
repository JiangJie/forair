requirejs.config({
  paths: {
    jquery: 'http://code.jquery.com/jquery-git2',
    bootstrap: 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min'
  },
  shim: {
    bootstrap: ['jquery']
  }
});