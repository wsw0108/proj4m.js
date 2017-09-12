import gcj02 from './gcj02'

const xPi = Math.PI * 3000.0 / 180.0

function fromWGS84 (p) {
  p = gcj02.fromWGS84(p)
  return fromGCJ02(p)
}

function toWGS84 (p) {
  p = toGCJ02(p)
  return gcj02.toWGS84(p)
}

function fromGCJ02 (p) {
  let x = p.x
  let y = p.y
  const z = Math.sqrt((x * x) + (y * y)) + (0.00002 * Math.sin(y * xPi))
  const theta = Math.atan2(y, x) + (0.000003 * Math.cos(x * xPi))
  x = (z * Math.cos(theta)) + 0.0065
  y = (z * Math.sin(theta)) + 0.006
  p.x = x
  p.y = y
  return p
}

function toGCJ02 (p) {
  let x = p.x
  let y = p.y
  x -= 0.0065
  y -= 0.006
  const z = Math.sqrt((x * x) + (y * y)) - (0.00002 * Math.sin(y * xPi))
  const theta = Math.atan2(y, x) - (0.000003 * Math.cos(x * xPi))
  x = z * Math.cos(theta)
  y = z * Math.sin(theta)
  p.x = x
  p.y = y
  return p
}

export default {
  fromGCJ02: fromGCJ02,
  toGCJ02: toGCJ02,
  fromWGS84: fromWGS84,
  toWGS84: toWGS84
}
