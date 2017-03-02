export default function (defs) {
  defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees')
  defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs')
  defs('GCJ02', '+proj=longlat +datum=GCJ02')
  defs('GCJ02MC', '+proj=merc +datum=GCJ02')
  defs('BD09LL', '+proj=longlat +datum=BD09')
  defs('BD09MC', '+proj=bmerc +datum=BD09')
  defs.WGS84 = defs['EPSG:4326']
}
