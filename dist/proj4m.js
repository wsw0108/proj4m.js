'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var proj4 = _interopDefault(require('proj4'));

var globals = function (defs) {
  defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
  defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs');
  defs('GCJ02', '+proj=longlat +datum=GCJ02');
  defs('GCJ02MC', '+proj=merc +datum=GCJ02');
  defs('BD09LL', '+proj=longlat +datum=BD09');
  defs('BD09MC', '+proj=bmerc +datum=BD09');
  defs.WGS84 = defs['EPSG:4326'];
};

var Const = {
  projNameLatLong: 'longlat',
  projNameMerc: 'merc',
  projNameBaidu: 'bmerc',

  datumCodeWGS84: 'wgs84',
  datumCodeGCJ02: 'gcj02',
  datumCodeBD09: 'bd09'
};

var Proj = function Proj (projName, datumCode, srsCode) {
  this.projName = projName ? projName.toLowerCase() : projName;
  this.datumCode = datumCode ? datumCode.toLowerCase() : datumCode;
  this.srsCode = srsCode;
  fixMarsProj(this);
};

function fixMarsProj (p) {
  if (p.datumCode === Const.datumCodeGCJ02 && !isLatLong(p.projName)) {
    p.projName = Const.projNameMerc;
  }
  if (p.datumCode === Const.datumCodeBD09 && !isLatLong(p.projName)) {
    p.projName = Const.projNameBaidu;
  }
  if (p.projName === Const.projNameBaidu) {
    p.datumCode = Const.datumCodeBD09;
  }
}

function isLatLong (name) {
  return name === 'longlat' || name === 'latlong' || name === 'lnglat' || name === 'latlng'
}

var parseProj = function (code) {
  var paramObj = code.split('+').map(function (v) { return v.trim(); }).filter(function (a) { return a; }).reduce(function (p, a) {
    var split = a.split('=');
    split.push(true);
    p[split[0].toLowerCase()] = split[1];
    return p
  }, {});
  return new Proj(paramObj.proj, paramObj.datum, code)
};

function defs (name) {
  if (arguments.length === 2) {
    var def = arguments[1];
    if (typeof def === 'string') {
      defs[name] = parseProj(def);
    } else {
      defs[name] = def;
    }
  } else if (arguments.length === 1) {
    if (typeof name === 'string') {
      if (name in defs) {
        return defs[name]
      }
    } else {
      console.log(name);
    }
  }
}

globals(defs);

function testObj (code) {
  return typeof code === 'string'
}

function testDef (code) {
  return code in defs
}

function testProj (code) {
  return code[0] === '+'
}

function parse$1 (code) {
  if (testObj(code)) {
    if (testDef(code)) {
      return defs[code]
    }
    if (testProj(code)) {
      return parseProj(code)
    }
  } else {
    return code
  }
}

var r = 6378137.0;
var maxLatitude = 85.0511287798;
var deg2Rad = Math.PI / 180.0;
var rad2Deg = 180.0 / Math.PI;

function forward (p) {
  var lng = p.x;
  var lat = p.y;
  var lat1 = Math.max(Math.min(maxLatitude, lat), -maxLatitude);
  var sin = Math.sin(lat1 * deg2Rad);
  var x = r * lng * deg2Rad;
  var y = r * Math.log((1 + sin) / (1 - sin)) / 2;
  p.x = x;
  p.y = y;
  return p
}

function inverse (p) {
  var x = p.x;
  var y = p.y;
  var lng = x * rad2Deg / r;
  var lat = (2 * Math.atan(Math.exp(y / r)) - Math.PI / 2) * rad2Deg;
  p.x = lng;
  p.y = lat;
  return p
}

var merc = {
  forward: forward,
  inverse: inverse,
  isLatLong: false
};

function identity (p) {
  return p
}

var longlat = {
  forward: identity,
  inverse: identity,
  isLatLong: true
};

function forward$1 (p) {
  return convertLL2MC(p)
}

function inverse$1 (p) {
  return convertMC2LL(p)
}

function convertLL2MC (p) {
  p.x = getLoop(p.x, -180, 180);
  p.y = getRange(p.y, -74, 74);
  for (var i = 0; i < aLLBAND.length; i++) {
    if (p.y >= aLLBAND[i]) {
      return convertor(p, aLL2MC[i])
    }
  }
  for (var i$1 = aLLBAND.length - 1; i$1 >= 0; i$1--) {
    if (p.y <= -aLLBAND[i$1]) {
      return convertor(p, aLL2MC[i$1])
    }
  }
}

function convertMC2LL (p) {
  var yAbs = Math.abs(p.y);
  for (var i = 0; i < aMCBAND.length; i++) {
    if (yAbs >= aMCBAND[i]) {
      return convertor(p, aMC2LL[i])
    }
  }
}

function convertor (p, table) {
  var d = Math.abs(p.y) / table[9];
  var x = table[0] + table[1] * Math.abs(p.x);
  var y = table[2];
  for (var i = 3; i <= 8; i++) {
    y += table[i] * Math.pow(d, i - 2);
  }
  p.x = x;
  p.y = y;
  return p
}

function getRange (v, min, max) {
  v = Math.max(v, min);
  v = Math.min(v, max);
  return v
}

function getLoop (v, min, max) {
  var d = max - min;
  while (v > max) {
    v -= d;
  }
  while (v < min) {
    v += d;
  }
  return v
}

var aMCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];

var aLLBAND = [75, 60, 45, 30, 15, 0];

var aMC2LL = [
  [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
    200.9824383106796, -187.2403703815547, 91.6087516669843,
    -23.38765649603339, 2.57121317296198, -0.03801003308653,
    17337981.2],
  [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289,
    96.32687599759846, -1.85204757529826, -59.36935905485877,
    47.40033549296737, -16.50741931063887, 2.28786674699375,
    10260144.86],
  [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
    59.74293618442277, 7.357984074871, -25.38371002664745,
    13.45380521110908, -3.29883767235584, 0.32710905363475,
    6856817.37],
  [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
    40.31678527705744, 0.65659298677277, -4.44255534477492,
    0.85341911805263, 0.12923347998204, -0.04625736007561,
    4482777.06],
  [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
    23.10934304144901, -0.00023663490511, -0.6321817810242,
    -0.00663494467273, 0.03430082397953, -0.00466043876332,
    2555164.4],
  [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
    7.47137025468032, -0.00000353937994, -0.02145144861037,
    -0.00001234426596, 0.00010322952773, -0.00000323890364,
    826088.5]
];

var aLL2MC = [
  [-0.0015702102444, 111320.7020616939, 1704480524535203,
    -10338987376042340, 26112667856603880, -35149669176653700,
    26595700718403920, -10725012454188240, 1800819912950474,
    82.5],
  [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
    -4082003173.641316, 10774905663.51142, -15171875531.51559,
    12053065338.62167, -5124939663.577472, 913311935.9512032,
    67.5],
  [0.00337398766765, 111320.7020202162, 4481351.045890365,
    -23393751.19931662, 79682215.47186455, -115964993.2797253,
    97236711.15602145, -43661946.33752821, 8477230.501135234,
    52.5],
  [0.00220636496208, 111320.7020209128, 51751.86112841131,
    3796837.749470245, 992013.7397791013, -1221952.21711287,
    1340652.697009075, -620943.6990984312, 144416.9293806241,
    37.5],
  [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
    2485758.690035394, 6070.750963243378, 54821.18345352118,
    9540.606633304236, -2710.55326746645, 1405.483844121726,
    22.5],
  [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
    823725.6402795718, 0.46104986909093, 2351.343141331292,
    1.58060784298199, 8.77738589078284, 0.37238884252424,
    7.45]
];

var bmerc = {
  forward: forward$1,
  inverse: inverse$1,
  isLatLong: false
};

var projMap = {};
projMap[Const.projNameLatLong] = longlat;
projMap[Const.projNameMerc] = merc;
projMap[Const.projNameBaidu] = bmerc;

function get (name) {
  return projMap[name]
}

var projection = {
  get: get
};

function identity$1 (p) {
  return p
}

var wgs84$1 = {
  fromWGS84: identity$1,
  toWGS84: identity$1
};

var axis = 6378245.0;
var offset = 0.00669342162296594323; // (a^2 - b^2) / a^2

function fromWGS84 (p) {
  if (outOfChina(p.x, p.y)) {
    return p
  }
  var d = delta(p.x, p.y);
  p.x += d.x;
  p.y += d.y;
  return p
}

function toWGS84 (p) {
  if (outOfChina(p.x, p.y)) {
    return p
  }
  var d = delta(p.x, p.y);
  p.x -= d.x;
  p.y -= d.y;
  return p
}

function transformLon (x, y) {
  var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
  return ret
}

function transformLat (x, y) {
  var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
  return ret
}

function delta (wgLon, wgLat) {
  var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
  var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
  var radLat = wgLat / 180.0 * Math.PI;
  var magic = Math.sin(radLat);
  magic = 1 - offset * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((axis * (1 - offset)) / (magic * sqrtMagic) * Math.PI);
  dLon = (dLon * 180.0) / (axis / sqrtMagic * Math.cos(radLat) * Math.PI);
  return {
    x: dLon,
    y: dLat
  }
}

function outOfChina (lon, lat) {
  if (lon < 72.004 || lon > 137.8347) {
    return true
  }
  if (lat < 0.8293 || lat > 55.8271) {
    return true
  }
  return false
}

var gcj02 = {
  fromWGS84: fromWGS84,
  toWGS84: toWGS84
};

var xPi = Math.Pi * 3000.0 / 180.0;

function fromWGS84$1 (p) {
  p = gcj02.fromWGS84(p);
  return fromGCJ02(p)
}

function toWGS84$1 (p) {
  p = toGCJ02(p);
  return gcj02.toWGS84(p)
}

function fromGCJ02 (p) {
  var x = p.x;
  var y = p.y;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi);
  x = z * Math.cos(theta) + 0.0065;
  y = z * Math.sin(theta) + 0.006;
  p.x = x;
  p.y = y;
  return p
}

function toGCJ02 (p) {
  var x = p.x;
  var y = p.y;
  x -= 0.0065;
  y -= 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
  x = z * Math.cos(theta);
  y = z * Math.sin(theta);
  p.x = x;
  p.y = y;
  return p
}

var bd09 = {
  fromGCJ02: fromGCJ02,
  toGCJ02: toGCJ02,
  fromWGS84: fromWGS84$1,
  toWGS84: toWGS84$1
};

var datumMap = {};
datumMap[Const.datumCodeWGS84] = wgs84$1;
datumMap[Const.datumCodeGCJ02] = gcj02;
datumMap[Const.datumCodeBD09] = bd09;

function get$1 (code) {
  return datumMap[code]
}

var datum = {
  get: get$1
};

function isMarsDatum (code) {
  return code === Const.datumCodeGCJ02 || code === Const.datumCodeBD09
}

function needProj4 (srcProj, dstProj) {
  return !isMarsDatum(srcProj.datumCode) && !isMarsDatum(dstProj.datumCode)
}

var transform = function (srcProj, dstProj, point) {
  if (Array.isArray(point)) {
    point = proj4.toPoint(point);
  }

  if (srcProj.srsCode === dstProj.srsCode) {
    return point
  }

  var useProj4 = needProj4(srcProj, dstProj);
  if (useProj4) {
    return proj4(srcProj.srsCode, dstProj.srsCode, point)
  }

  var sProj = projection.get(srcProj.projName);
  var dProj = projection.get(dstProj.projName);
  if (!sProj.isLatLong) {
    point = sProj.inverse(point);
  }
  if (sProj.datumCode !== dProj.datumCode) {
    var sDatum = datum.get(sProj.datumCode);
    var dDatum = datum.get(dProj.datumCode);
    if (sProj.datumCode === Const.datumCodeGCJ02 && dProj.datumCode === Const.datumCodeBD09) {
      point = dDatum.fromGCJ02(point);
    } else if (sProj.datumCode === Const.datumCodeBD09 && dProj.datumCode === Const.datumCodeGCJ02) {
      point = sDatum.toGCJ02(point);
    } else {
      point = sDatum.toWGS84(point);
      point = dDatum.fromWGS84(point);
    }
  }
  if (!dProj.isLatLong) {
    point = dProj.forward(point);
  }
  return point
};

var wgs84 = parse$1('WGS84');

function transformer (from, to, coords) {
  if (Array.isArray(coords)) {
    var transformed = transform(from, to, coords);
    if (coords.length === 3) {
      return [transformed.x, transformed.y, transformed.z]
    } else {
      return [transformed.x, transformed.y]
    }
  } else {
    return transform(from, to, coords)
  }
}

function checkProj (item) {
  if (item instanceof Proj) {
    return item
  }
  if (item.oProj) {
    return item.oProj
  }
  return parse$1(item)
}

function proj4m$1 (fromProj, toProj, coord) {
  fromProj = checkProj(fromProj);
  var single = false;
  var obj;
  if (typeof toProj === 'undefined') {
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
    coord = toProj;
    toProj = fromProj;
    fromProj = wgs84;
    single = true;
  }
  toProj = checkProj(toProj);
  if (coord) {
    return transformer(fromProj, toProj, coord)
  } else {
    obj = {
      forward: function (coords) {
        return transformer(fromProj, toProj, coords)
      },
      inverse: function (coords) {
        return transformer(toProj, fromProj, coords)
      }
    };
    if (single) {
      obj.oProj = toProj;
    }
    return obj
  }
}

proj4m$1.defs = defs;
proj4m$1.transform = transform;

module.exports = proj4m$1;
