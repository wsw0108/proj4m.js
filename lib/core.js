import parseCode from './parseCode'
import Proj from './proj'
import transform from './transform'

const wgs84 = parseCode('WGS84')

function transformer (from, to, coords) {
  if (Array.isArray(coords)) {
    const transformed = transform(from, to, coords)
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
  return parseCode(item)
}

function proj4m (fromProj, toProj, coord) {
  fromProj = checkProj(fromProj)
  let single = false
  let obj
  if (typeof toProj === 'undefined') {
    toProj = fromProj
    fromProj = wgs84
    single = true
  } else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
    coord = toProj
    toProj = fromProj
    fromProj = wgs84
    single = true
  }
  toProj = checkProj(toProj)
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
    }
    if (single) {
      obj.oProj = toProj
    }
    return obj
  }
}

export default proj4m
