var route = function(app) {
	app.get('/', function(req, res, next) {
		res.end('hello');
	});
};
exports = module.exports = {
	route: route
};