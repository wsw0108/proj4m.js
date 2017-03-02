import Const from './constants'

export default class Proj {
  constructor (projName, datumCode, srsCode) {
    this.projName = projName ? projName.toLowerCase() : projName
    this.datumCode = datumCode ? datumCode.toLowerCase() : datumCode
    this.srsCode = srsCode
    fixMarsProj(this)
  }
}

function fixMarsProj (p) {
  if (p.datumCode === Const.datumCodeGCJ02 && !isLatLong(p.projName)) {
    p.projName = Const.projNameMerc
  }
  if (p.datumCode === Const.datumCodeBD09 && !isLatLong(p.projName)) {
    p.projName = Const.projNameBaidu
  }
  if (p.projName === Const.projNameBaidu) {
    p.datumCode = Const.datumCodeBD09
  }
}

function isLatLong (name) {
  return name === 'longlat' || name === 'latlong' || name === 'lnglat' || name === 'latlng'
}
