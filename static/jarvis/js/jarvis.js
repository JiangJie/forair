var op = Object.prototype,
    ostring = op.toString;
var isFunction = function(it) {
    return ostring.call(it) === '[object Function]';
}
var isArray = function(it) {
    return ostring.call(it) === '[object Array]';
}