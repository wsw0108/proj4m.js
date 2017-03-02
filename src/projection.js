import Const from './constants'
import merc from './projections/merc'
import longlat from './projections/longlat'
import bmerc from './projections/baidu'

const projMap = {}
projMap[Const.projNameLatLong] = longlat
projMap[Const.projNameMerc] = merc
projMap[Const.projNameBaidu] = bmerc

function get (name) {
  return projMap[name]
}

export default {
  get: get
}
