[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# furkot-kml

Generate KML file from [Furkot] trip data.

## Install

```sh
$ npm install --save furkot-kml
```

## Usage

```js
var kml = require('furkot-kml');

kml(ostream, trip);
```

## License

MIT © [code42day](https://code42day.com)

[Furkot]: https://trips.furkot.com

[npm-image]: https://img.shields.io/npm/v/@furkot/export-kml
[npm-url]: https://npmjs.org/package/@furkot/export-kml

[build-image]: https://img.shields.io/github/workflow/status/furkot/export-kml/check
[build-url]: https://github.com/furkot/export-kml/actions/workflows/check.yaml

[deps-image]: https://img.shields.io/librariesio/release/npm/@furkot/export-kml
[deps-url]: https://libraries.io/npm/@furkot%2Fexport-kml
