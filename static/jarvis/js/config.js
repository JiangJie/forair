requirejs.config({
  paths: {
    jquery: 'http://code.jquery.com/jquery-2.0.0.min',
    bootstrap: 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min'
  },
  shim: {
    bootstrap: ['jquery']
  }
});