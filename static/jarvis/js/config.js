requirejs.config({
  paths: {
    jquery: 'http://code.jquery.com/jquery-2.0.0.min',
    isotope: '/jarvis/js/jquery-plugin/jquery.isotope.min',
    imagesloaded: '/jarvis/js/jquery-plugin/jquery.imagesloaded.min',
    jinja: '/jarvis/js/jinja.min',
    bootstrap: 'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min'
  },
  shim: {
    bootstrap: ['jquery'],
    isotope: ['jquery'],
    imagesloaded: ['jquery']
  }
});