var elem = require('gexode').elem;
var buffer = require('./buffer');
var colors = require('./colors');

exports = module.exports = toKml;
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

function nd(el, name, description, address) {
  if (name) {
    el.add(elem('name').text(name));
  }
  if (address) {
    el.add(elem('address').text(address));
  }
  if (description) {
    el.add(elem('description').text(description));
  }
  return el;
}

function kml() {
  return elem('kml', {
    xmlns: 'http://www.opengis.net/kml/2.2'
  });
}

function document(metadata) {
  return nd(elem('Document'), metadata.name, metadata.desc);
}

function data(item, property) {
  var el, value = item[property];
  if (value) {
    el = elem('Data', {name: stepProperty2kmlProperty[property]});
    el.add(elem('value').text('' + value));
  }
  return el;
}

function lineStyle(pl, color) {
  var st = elem('Style'),
    ls = elem('LineStyle');

  ls.add(elem('color').text(colors[color]));
  ls.add(elem('width').text('4'));

  st.add(ls);
  pl.add(st);
}

function lineString(folder, feature) {
  var pl = nd(elem('Placemark'), feature.name, feature.desc),
    ls = elem('LineString');

  if (feature.color) {
    lineStyle(pl, feature.color);
  }

  folder.add(pl);
  pl.add(ls);

  return ls;
}

function extendedData(step) {
  var ed = elem('ExtendedData'), hasData;
  Object.keys(stepProperty2kmlProperty)
    .map(data.bind(null, step))
    .forEach(function (el) {
      if (el) {
        hasData = true;
        ed.add(el);
      }
    });
  return hasData && ed;
}

function point(coordinates) {
  var coordText = toFixed(coordinates.lon) + ',' + toFixed(coordinates.lat);
  return elem('Point').add(elem('coordinates').text(coordText));
}

function addPoints(doc, points) {
  points.forEach(function (step) {
    var pl, ed;
    if (step.coordinates) {
      pl = nd(elem('Placemark'), step.name, step.notes, step.address);
      ed = extendedData(step);
      if (ed) {
        pl.add(ed);
      }
      pl.add(point(step.coordinates));
      doc.add(pl);
    }
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
      // FIXME: unlike anywhere else we generate lat, lon pairs here
      coords.push(toFixed(p[1]) + ',' + toFixed(p[0]));
    }
    return coords;
  }, []);
}


function addTrack(folder, track) {
  var ls = lineString(folder, track);

  if (!track.points) {
    return;
  }

  var coordinates = track.points.reduce(function(coords, step) {
    coords.push.apply(coords, points2coordinates(step.track));
    return coords;
  }, []).join(' ');

  if (coordinates) {
    ls.add(elem('coordinates').text(coordinates));
  }
}

function addTracks(doc, tracks) {
  var folder = nd(elem('Folder'), 'tracks');
  tracks.forEach(addTrack.bind(null, folder));
  doc.add(folder);
}


function addRoute(folder, route) {
  var ls = lineString(folder, route),
    coordinates = points2coordinates(route.points).join(' ');

  if (coordinates) {
    ls.add(elem('coordinates').text(coordinates));
  }
}

function addRoutes(doc, routes) {
  var folder = nd(elem('Folder'), 'routes');
  routes.forEach(addRoute.bind(null, folder));
  doc.add(folder);
}

function writeKml(out, options) {
  var root = kml(),
    doc = document(options.metadata);

  root.add(doc);

  // HACK: we seem to use options.routes[0].points in some modules
  if (!options.waypoints) {
    options.waypoints = options.routes && options.routes[0] && options.routes[0].points;
  }
  if (options.waypoints) {
    addPoints(doc, options.waypoints);
  }
  if (options.routes) {
    addRoutes(doc, options.routes);
  }
  if (options.tracks) {
    addTracks(doc, options.tracks);
  }

  root.write(out);
}

function toKml(options) {
  var buf = buffer();
  writeKml(buf, options);
  return buf.toString();
}
