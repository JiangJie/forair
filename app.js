
/**
 * Module dependencies.
 */
var PORT = 2012;
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')
  , swig = require('swig');

var app = express();
var projectDir = __dirname;

app.configure(function(){
  app.set('port', process.env.PORT || PORT);
  app.set('views', __dirname + '/views');
  app.engine('.html', cons.swig);
  app.set('view engine', 'html');
  app.set('view options', {
    layout : false
  });
  swig.init({
    allowErrors: true,
    autoescape: true,
    cache: false,
    encoding: 'utf8',
    filters: {},
    root: './views',
    tags: {},
    extensions: {},
    tzOffset: 0
  });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./tmp'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('air'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes.route(app);

app.use(function(req, res, next) {
  if (req.xhr) {
    res.send(404, {recode: 10404, error: '404你懂的'});
  } else {
    res.status(404);
    res.render('404');
  }
});
app.use(function(err, req, res, next) {
  var status = err.status || 500;
  if (req.xhr) {
    res.send(status, {recode: 10500, error: '出错了'});
  } else {
    res.status(status);
    res.render('500');
  }
});
app.listen(app.get('port'), function(){
  console.log("server listening on port %d in %s mode, pid %d", PORT , app.settings.env, process.pid);
});
