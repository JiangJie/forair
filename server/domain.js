var domain = require('domain'),
  d = domain.create();

d.on('error', function(err) {
  console.error('error:', err.stack);
  (err.domainBound)(err);
});

module.exports = d;