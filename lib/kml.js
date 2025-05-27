const { generator } = require('gexode');
const colors = require('./colors');

module.exports = writeKml;

writeKml.contentType = 'application/vnd.google-earth.kml+xml';
writeKml.extension = 'kml';
writeKml.encoding = 'utf8';

const stepProperty2kmlProperty = {
  visit_duration: 'duration',
  pin: 'icon',
  url: 'url'
};

function* each(array, fn, thisArg) {
  if (!array) {
    return;
  }
  for (let i = 0; i < array.length; i++) {
    yield* fn.call(thisArg, array[i], i, array);
  }
}

function toFixed(c) {
  return c.toFixed(6);
}

function* writeKml(options) {
  const gen = generator({ pretty: true });

  function* nd(name, description, address) {
    yield* gen.elIfText('name', name);
    yield* gen.elIfText('address', address);
    yield* gen.elIfText('description', description);
  }

  function* lineStyle(color) {
    yield* gen.start('Style');
    yield* gen.start('LineStyle');

    yield* gen.el('color', null, colors[color]);
    yield* gen.el('width', null, 4);

    yield* gen.end();
    yield* gen.end();
  }

  function* lineString(feature, coordinates) {
    yield* gen.start('Placemark');
    yield* nd(feature.name, feature.desc);
    if (feature.color) {
      yield* lineStyle(feature.color);
    }
    yield* gen.start('LineString');
    if (coordinates) {
      yield* gen.el('coordinates', null, coordinates.join(' '));
    }
    yield* gen.end();
    yield* gen.end();
  }

  function* extendedData(step) {
    const items = Object.keys(stepProperty2kmlProperty)
      .map(key => {
        return {
          name: stepProperty2kmlProperty[key],
          value: step[key]
        };
      })
      .filter(item => item.value);

    if (!items.length) {
      return;
    }

    yield* gen.start('ExtendedData');
    for (const item of items) {
      yield* gen.start('Data', { name: item.name });
      yield* gen.el('value', null, item.value);
      yield* gen.end();
    }
    yield* gen.end();
  }

  function* point(coordinates) {
    const coordText = toFixed(coordinates.lon) + ',' + toFixed(coordinates.lat);
    yield* gen.start('Point');
    yield* gen.el('coordinates', null, coordText);
    yield* gen.end();
  }

  function* addPoints(points) {
    yield* each(points, function* (step) {
      if (!step.coordinates) {
        return;
      }
      yield* gen.start('Placemark');
      yield* nd(step.name, step.notes, step.address);
      yield* extendedData(step);
      yield* point(step.coordinates);
      yield* gen.end();
    });
  }

  function points2coordinates(points) {
    if (!points) {
      return [];
    }
    return points.reduce((coords, p) => {
      if (p.coordinates) {
        coords.push(toFixed(p.coordinates.lon) + ',' + toFixed(p.coordinates.lat));
      } else if (Array.isArray(p)) {
        coords.push(toFixed(p[0]) + ',' + toFixed(p[1]));
      }
      return coords;
    }, []);
  }

  function* addTrack(track) {
    let coordinates;

    if (track.points) {
      coordinates = track.points.reduce((coords, step) => {
        coords.push.apply(coords, points2coordinates(step.track));
        return coords;
      }, []);
    }
    yield* lineString(track, coordinates);
  }

  function* addTracks(tracks) {
    yield* gen.start('Folder');
    yield* nd('tracks');
    yield* each(tracks, addTrack);
    yield* gen.end();
  }

  function* addRoute(route) {
    const coordinates = points2coordinates(route.points);
    yield* lineString(route, coordinates);
  }

  function* addRoutes(routes) {
    yield* gen.start('Folder');
    yield* nd('routes');
    yield* each(routes, addRoute);
    yield* gen.end();
  }

  function* generate() {
    // HACK: we seem to use options.routes[0].points in some modules
    if (!options.waypoints) {
      options.waypoints = options.routes?.[0]?.points;
      delete options.routes;
    }

    yield* gen.header();
    yield* gen.start('kml', {
      xmlns: 'http://www.opengis.net/kml/2.2'
    });

    yield* gen.start('Document');
    yield* nd(options.metadata.name, options.metadata.desc);

    yield* addPoints(options.waypoints);

    if (options.routes) {
      yield* addRoutes(options.routes);
    }
    if (options.tracks) {
      yield* addTracks(options.tracks);
    }

    yield* gen.end();
    yield* gen.end();
  }

  yield* generate();
}
