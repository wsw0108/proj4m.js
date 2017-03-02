const axis = 6378245.0
const offset = 0.00669342162296594323 // (a^2 - b^2) / a^2

function fromWGS84 (p) {
  if (outOfChina(p.x, p.y)) {
    return p
  }
  const d = delta(p.x, p.y)
  p.x += d.x
  p.y += d.y
  return p
}

function toWGS84 (p) {
  if (outOfChina(p.x, p.y)) {
    return p
  }
  const d = delta(p.x, p.y)
  p.x -= d.x
  p.y -= d.y
  return p
}

function transformLon (x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0
  return ret
}

function transformLat (x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
  ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0
  ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0
  ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0
  return ret
}

function delta (wgLon, wgLat) {
  let dLat = transformLat(wgLon - 105.0, wgLat - 35.0)
  let dLon = transformLon(wgLon - 105.0, wgLat - 35.0)
  const radLat = wgLat / 180.0 * Math.PI
  let magic = Math.sin(radLat)
  magic = 1 - offset * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((axis * (1 - offset)) / (magic * sqrtMagic) * Math.PI)
  dLon = (dLon * 180.0) / (axis / sqrtMagic * Math.cos(radLat) * Math.PI)
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

export default {
  fromWGS84: fromWGS84,
  toWGS84: toWGS84
}
