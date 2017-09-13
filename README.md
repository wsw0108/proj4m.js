
# proj4m.js [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Extends [proj4js][proj4js-url] to handle Mars projections and transformation between them.

## Mars Projections

- GCJ02
  - GCJ02, `+proj=longlat +datum=GCJ02`
  - GCJ02MC, `+proj=merc +datum=GCJ02`
- BD09
  - BD09LL, `+proj=longlat +datum=BD09`
  - BD09MC, `+proj=bmerc +datum=BD09`

## EPSG3857 & EPSG4326

- EPSG:3857, `+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs`
- EPSG:4326, `+proj=longlat +datum=WGS84 +no_defs`

# LICENSE

MIT © [wsw0108](https://github.com/wsw0108), see LICENSE file

[proj4js-url]: https://github.com/proj4js/proj4js
[npm-image]: https://badge.fury.io/js/proj4m.svg
[npm-url]: https://npmjs.org/package/proj4m
[travis-image]: https://travis-ci.org/wsw0108/proj4m.js.svg?branch=master
[travis-url]: https://travis-ci.org/wsw0108/proj4m.js
[daviddm-image]: https://david-dm.org/wsw0108/proj4m.js.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/wsw0108/proj4m.js
