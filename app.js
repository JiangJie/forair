
/**
 * Module dependencies.
 */
var POST = 3000;
var express = require('express'),
  routes = require('./server/routes'),
  http = require('http'),
  path = require('path'),
  db = require('./server/mongo');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || POST);
  app.set('views', __dirname + '/server/views');
  // app.set('view engine', 'jade');
  // app.use(express.favicon('/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes.route(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode, pid %d", app.get('port') , app.settings.env, process.pid);
});
