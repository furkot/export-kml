const should = require('should');
const fs = require('fs');
const path = require('path');

const kml = require('../');

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateKML(t) {
  return Array.from(kml(t)).join('');
}

describe('furkot-kml node module', function () {
  it('simple trip', function () {
    const t = require('./fixtures/simple-trip.json');
    const expected = readFileSync('fixtures/simple.kml');
    const generated = generateKML(t);
    generated.should.eql(expected);
  });

  it('multi trip', function () {
    const t = require('./fixtures/multi-trip.json');
    const expected = readFileSync('fixtures/multi.kml');
    const generated = generateKML(t);
    generated.should.eql(expected);
  });

  it('day routes', function () {
    const t = require('./fixtures/day-routes.json');
    const expected = readFileSync('fixtures/day-routes.kml');
    const generated = generateKML(t);
    generated.should.eql(expected);
  });

  it('day tracks', function () {
    const t = require('./fixtures/day-tracks.json');
    const expected = readFileSync('fixtures/day-tracks.kml');
    const generated = generateKML(t);
    generated.should.eql(expected);
  });

  it('empty polyline', function () {
    const t = require('./fixtures/empty-polyline.json');
    const generated = generateKML(t);
    should.exist(generated);
  });
});
