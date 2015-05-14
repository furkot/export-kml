var elem = require('gexode').elem;
var buffer = require('./buffer');

exports = module.exports = toKml;
exports.contentType = 'application/vnd.google-earth.kml+xml';
exports.extension = 'kml';

var stepProperty2kmlProperty = {
  'visit_duration': 'duration',
  'pin': 'icon',
  'url': 'url'
};

function nd(el, name, description) {
  if (name) {
    el.add(elem('name').text(name));
  }
  if (description) {
    el.add(elem('description').text(description));
  }
  return el;
}

function kml() {
  return elem('kml', {
    xmlns: 'http://earth.google.com/kml/2.1'
  });
}

function document(metadata) {
  return nd(elem('Document'), metadata.name, metadata.desc);
}

function placemark(step) {
  var pl = nd(elem('Placemark'), step.name, step.notes);
  if (step.address) {
    pl.add(elem('address').text(step.address));
  }
  return pl;
}

function data(item, property) {
  var el, value = item[property];
  if (value) {
    el = elem('Data', {name: stepProperty2kmlProperty[property]});
    el.add(elem('value').text('' + value));
  }
  return el;
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
  var coordText = coordinates.lon.toFixed(6) + ',' +
    coordinates.lat.toFixed(6) + ',0';
  return elem('Point').add(elem('coordinates').text(coordText));
}

function writeKml(out, options) {
  var root = kml(), doc = document(options.metadata);
  root.add(doc);
  options.routes[0].points.forEach(function (step) {
    var pl, ed;
    if (step.coordinates) {
      pl = placemark(step);
      pl.add(point(step.coordinates));
      ed = extendedData(step);
      if (ed) {
        pl.add(ed);
      }
      doc.add(pl);
    }
  });
  root.write(out);
}

function toKml(options) {
  var buf = buffer();
  writeKml(buf, options);
  return buf.toString();
}
