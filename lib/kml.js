var stream = require('gexode').stream;
var colors = require('./colors');

exports = module.exports = writeKml;
exports.contentType = 'application/vnd.google-earth.kml+xml';
exports.extension = 'kml';

var stepProperty2kmlProperty = {
  'visit_duration': 'duration',
  'pin': 'icon',
  'url': 'url'
};

function toFixed(c) {
  return c.toFixed(5);
}

function writeKml(ostream, options) {
  var out = stream(ostream);

  function nd(name, description, address) {
    out.elIfText('name', name);
    out.elIfText('address', address);
    out.elIfText('description', description);
  }

  function lineStyle(color) {
    out.start('Style');
    out.start('LineStyle');

    out.el('color', null, colors[color]);
    out.el('width', null, 4);

    out.end();
    out.end();
  }

  function lineString(feature, coordinates) {
    out.start('Placemark');
    nd(feature.name, feature.desc);
    if (feature.color) {
      lineStyle(feature.color);
    }
    out.start('LineString');
    if (coordinates) {
      out.el('coordinates', null, coordinates.join(' '));
    }
    out.end();
    out.end();
  }

  function extendedData(step) {
    var items = Object.keys(stepProperty2kmlProperty)
      .map(function(key) {
        return {
          name: stepProperty2kmlProperty[key],
          value: step[key]
        };
      })
      .filter(function(item) {
        return item.value;
      });

    if (!items.length) {
      return;
    }

    out.start('ExtendedData');
    items.forEach(function(item) {
      out.start('Data', { name:  item.name });
      out.el('value', null, item.value);
      out.end();
    });
    out.end();
  }

  function point(coordinates) {
    var coordText = toFixed(coordinates.lon) + ',' + toFixed(coordinates.lat);
    out.start('Point');
    out.el('coordinates', null, coordText);
    out.end();
  }

  function addPoints(points) {
    points.forEach(function (step) {
      if (!step.coordinates) {
        return;
      }
      out.start('Placemark');
      nd(step.name, step.notes, step.address);
      extendedData(step);
      point(step.coordinates);
      out.end();
    });
  }

  function points2coordinates(points) {
    if (!points) {
      return [];
    }
    return points.reduce(function(coords, p) {
      if (p.coordinates) {
        coords.push(toFixed(p.coordinates.lon) + ',' + toFixed(p.coordinates.lat));
      } else if (Array.isArray(p)) {
        coords.push(toFixed(p[0]) + ',' + toFixed(p[1]));
      }
      return coords;
    }, []);
  }


  function addTrack(track) {
    var coordinates;

    if (track.points) {
      coordinates = track.points.reduce(function(coords, step) {
        coords.push.apply(coords, points2coordinates(step.track));
        return coords;
      }, []);
    }
    lineString(track, coordinates);
  }

  function addTracks(tracks) {
    out.start('Folder');
    nd('tracks');
    tracks.forEach(addTrack);
    out.end();
  }

  function addRoute(route) {
    var coordinates = points2coordinates(route.points);
    lineString(route, coordinates);
  }

  function addRoutes(routes) {
    out.start('Folder');
    nd('routes');
    routes.forEach(addRoute);
    out.end();
  }

  // HACK: we seem to use options.routes[0].points in some modules
  if (!options.waypoints) {
    options.waypoints = options.routes && options.routes[0] && options.routes[0].points;
    delete options.routes;
  }

  out.start('kml', {
    xmlns: 'http://www.opengis.net/kml/2.2'
  });

  out.start('Document');
  nd(options.metadata.name, options.metadata.desc);

  if (options.waypoints) {
    addPoints(options.waypoints);
  }
  if (options.routes) {
    addRoutes(options.routes);
  }
  if (options.tracks) {
    addTracks(options.tracks);
  }

  out.end();
  out.end();
  ostream.end();
}
