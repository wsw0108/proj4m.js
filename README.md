
# proj4m.js

Handle Mars projections and transformation between them.

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

## Others
The others will be handled by [proj4js](https://github.com/proj4js/proj4js).

# LICENSE
MIT, see LICENSE file
