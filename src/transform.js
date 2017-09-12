import proj4 from 'proj4'
import projection from './projection'
import datum from './datum'
import Const from './constants'

function isMarsDatum (code) {
  return code === Const.datumCodeGCJ02 || code === Const.datumCodeBD09
}

function needProj4 (srcProj, dstProj) {
  return !isMarsDatum(srcProj.datumCode) && !isMarsDatum(dstProj.datumCode)
}

export default function (srcProj, dstProj, point) {
  if (Array.isArray(point)) {
    point = proj4.toPoint(point)
  }

  if (srcProj.srsCode === dstProj.srsCode) {
    return point
  }

  const useProj4 = needProj4(srcProj, dstProj)
  if (useProj4) {
    return proj4(srcProj.srsCode, dstProj.srsCode, point)
  }

  const sProj = projection.get(srcProj.projName)
  const dProj = projection.get(dstProj.projName)
  if (!sProj.isLatLong) {
    point = sProj.inverse(point)
  }
  if (srcProj.datumCode !== dstProj.datumCode) {
    const sDatum = datum.get(srcProj.datumCode)
    const dDatum = datum.get(dstProj.datumCode)
    if (srcProj.datumCode === Const.datumCodeGCJ02 && dstProj.datumCode === Const.datumCodeBD09) {
      point = dDatum.fromGCJ02(point)
    } else if (srcProj.datumCode === Const.datumCodeBD09 && dstProj.datumCode === Const.datumCodeGCJ02) {
      point = sDatum.toGCJ02(point)
    } else {
      point = sDatum.toWGS84(point)
      point = dDatum.fromWGS84(point)
    }
  }
  if (!dProj.isLatLong) {
    point = dProj.forward(point)
  }
  return point
}
