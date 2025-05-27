import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import kml from '../lib/kml.js';

import dayRoutes from './fixtures/day-routes.json' with { type: 'json' };
import dayTracks from './fixtures/day-tracks.json' with { type: 'json' };
import emptyPolyline from './fixtures/empty-polyline.json' with { type: 'json' };
import multiTrip from './fixtures/multi-trip.json' with { type: 'json' };
import simpleTrip from './fixtures/simple-trip.json' with { type: 'json' };

function readFileSync(name) {
  return fs.readFileSync(path.join(import.meta.dirname, name), 'utf8');
}

function generateKML(t) {
  return Array.from(kml(t)).join('');
}

test('simple trip', t => {
  const expected = readFileSync('fixtures/simple.kml');
  const generated = generateKML(simpleTrip);
  t.assert.equal(generated, expected);
});

test('multi trip', t => {
  const expected = readFileSync('fixtures/multi.kml');
  const generated = generateKML(multiTrip);
  t.assert.equal(generated, expected);
});

test('day routes', t => {
  const expected = readFileSync('fixtures/day-routes.kml');
  const generated = generateKML(dayRoutes);
  t.assert.equal(generated, expected);
});

test('day tracks', t => {
  const expected = readFileSync('fixtures/day-tracks.kml');
  const generated = generateKML(dayTracks);
  t.assert.equal(generated, expected);
});

test('empty polyline', t => {
  const generated = generateKML(emptyPolyline);
  t.assert.ok(generated);
});
