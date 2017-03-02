import Const from './constants'
import wgs84 from './datums/wgs84'
import gcj02 from './datums/gcj02'
import bd09 from './datums/bd09'

const datumMap = {}
datumMap[Const.datumCodeWGS84] = wgs84
datumMap[Const.datumCodeGCJ02] = gcj02
datumMap[Const.datumCodeBD09] = bd09

function get (code) {
  return datumMap[code]
}

export default {
  get: get
}
