const should = require('should');
const fs = require('fs');
const path = require('path');
const WritableStreamBuffer = require('stream-buffers').WritableStreamBuffer;

const kml = require('../');

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateKML(t, fn) {
  const ostream = new WritableStreamBuffer();
  kml(ostream, t);
  ostream
    .on('error', fn)
    .on('finish', function () {
      fn(null, ostream.getContentsAsString('utf8'));
    });
}

describe('furkot-kml node module', function () {
  it('simple trip', function (done) {
    const t = require('./fixtures/simple-trip.json');
    const expected = readFileSync('fixtures/simple.kml');
    generateKML(t, function (err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('multi trip', function (done) {
    const t = require('./fixtures/multi-trip.json');
    const expected = readFileSync('fixtures/multi.kml');
    generateKML(t, function (err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('day routes', function (done) {
    const t = require('./fixtures/day-routes.json');
    const expected = readFileSync('fixtures/day-routes.kml');
    generateKML(t, function (err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('day tracks', function (done) {
    const t = require('./fixtures/day-tracks.json');
    const expected = readFileSync('fixtures/day-tracks.kml');
    generateKML(t, function (err, generated) {
      generated.should.eql(expected);
      done(err);
    });
  });

  it('empty polyline', function (done) {
    const t = require('./fixtures/empty-polyline.json');
    generateKML(t, function (err, generated) {
      should.exist(generated);
      done(err);
    });
  });
});
