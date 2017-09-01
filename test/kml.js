var should = require('should');
var fs = require('fs');
var path = require('path');
var WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

var kml = require('../');

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateKML(t, fn) {
  var ostream = new WritableStreamBuffer();
  kml(ostream, t);
  ostream
  .on('error', fn)
  .on('finish', function() {
    fn(null, ostream.getContentsAsString('utf8'));
  });
}

describe('furkot-kml node module', function () {
  it('simple trip', function (done) {
    var t = require('./fixtures/simple-trip.json'),
      expected = readFileSync('fixtures/simple.kml');
    generateKML(t, function(err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('multi trip', function (done) {
    var t = require('./fixtures/multi-trip.json'),
      expected = readFileSync('fixtures/multi.kml');
    generateKML(t, function(err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('day routes', function (done) {
    var t = require('./fixtures/day-routes.json'),
      expected = readFileSync('fixtures/day-routes.kml');
    generateKML(t, function(err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('day tracks', function (done) {
    var t = require('./fixtures/day-tracks.json'),
      expected = readFileSync('fixtures/day-tracks.kml');
    generateKML(t, function(err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('empty polyline', function (done) {
    var t = require('./fixtures/empty-polyline.json');
    generateKML(t, function(err, generated) {
      should.exist(generated);
      done(err);
    });
  });
});
