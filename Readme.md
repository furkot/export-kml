[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# @furkot/export-kml

Generate KML file from [Furkot] trip data.

## Install

```sh
$ npm install --save @furkot/export-kml
```

## Usage

```js
const exportKml = require('@furkot/export-kml');

// data is a generator/iterable
const data = kml(trip); 
```

## License

MIT © [code42day](https://code42day.com)

[Furkot]: https://trips.furkot.com

[npm-image]: https://img.shields.io/npm/v/@furkot/export-kml
[npm-url]: https://npmjs.org/package/@furkot/export-kml

[build-image]: https://img.shields.io/github/actions/workflow/status/furkot/export-kml/check.yaml?branch=main
[build-url]: https://github.com/furkot/export-kml/actions/workflows/check.yaml

[deps-image]: https://img.shields.io/librariesio/release/npm/@furkot/export-kml
[deps-url]: https://libraries.io/npm/@furkot%2Fexport-kml
