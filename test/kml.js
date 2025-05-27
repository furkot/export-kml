const { describe, it } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const kml = require('../lib/kml');

function readFileSync(name) {
  return fs.readFileSync(path.join(__dirname, name), 'utf8');
}

function generateKML(t) {
  return Array.from(kml(t)).join('');
}

describe('furkot-kml node module', () => {
  it('simple trip', t => {
    const simpleTrip = require('./fixtures/simple-trip.json');
    const expected = readFileSync('fixtures/simple.kml');
    const generated = generateKML(simpleTrip);
    t.assert.equal(generated, expected);
  });

  it('multi trip', t => {
    const multiTrip = require('./fixtures/multi-trip.json');
    const expected = readFileSync('fixtures/multi.kml');
    const generated = generateKML(multiTrip);
    t.assert.equal(generated, expected);
  });

  it('day routes', t => {
    const dayRoutes = require('./fixtures/day-routes.json');
    const expected = readFileSync('fixtures/day-routes.kml');
    const generated = generateKML(dayRoutes);
    t.assert.equal(generated, expected);
  });

  it('day tracks', t => {
    const dayTracks = require('./fixtures/day-tracks.json');
    const expected = readFileSync('fixtures/day-tracks.kml');
    const generated = generateKML(dayTracks);
    t.assert.equal(generated, expected);
  });

  it('empty polyline', t => {
    const emptyPolyline = require('./fixtures/empty-polyline.json');
    const generated = generateKML(emptyPolyline);
    t.assert.ok(generated);
  });
});
