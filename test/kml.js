var fs = require('fs');
var path = require('path');
var kml = require('../');

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

describe('furkot-kml node module', function () {
  it('simple trip', function() {
    var t = require('./fixtures/simple-trip.json'),
      generated = kml(t),
      expected = readFileSync('fixtures/simple.kml');

    generated.should.eql(expected);
  });

  it('multi trip', function() {
    var t = require('./fixtures/multi-trip.json'),
      generated = kml(t),
      expected = readFileSync('fixtures/multi.kml');

    generated.should.eql(expected);

  });
});
