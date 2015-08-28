var should = require('should');
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

  it('day routes', function() {
    var t = require('./fixtures/day-routes.json'),
      generated = kml(t),
      expected = readFileSync('fixtures/day-routes.kml');

    generated.should.eql(expected);

  });

  it('day tracks', function() {
    var t = require('./fixtures/day-tracks.json'),
      generated = kml(t),
      expected = readFileSync('fixtures/day-tracks.kml');

    generated.should.eql(expected);

  });

  it('empty polyline', function () {
    var t = require('./fixtures/empty-polyline.json');
    should.exist(kml(t));
  });
});
