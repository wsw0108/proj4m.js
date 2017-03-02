const r = 6378137.0
const maxLatitude = 85.0511287798
const deg2Rad = Math.PI / 180.0
const rad2Deg = 180.0 / Math.PI

function forward (p) {
  const lng = p.x
  const lat = p.y
  const lat1 = Math.max(Math.min(maxLatitude, lat), -maxLatitude)
  const sin = Math.sin(lat1 * deg2Rad)
  const x = r * lng * deg2Rad
  const y = r * Math.log((1 + sin) / (1 - sin)) / 2
  p.x = x
  p.y = y
  return p
}

function inverse (p) {
  const x = p.x
  const y = p.y
  const lng = x * rad2Deg / r
  const lat = ((2 * Math.atan(Math.exp(y / r))) - (Math.PI / 2)) * rad2Deg
  p.x = lng
  p.y = lat
  return p
}

export default {
  forward: forward,
  inverse: inverse,
  isLatLong: false
}
