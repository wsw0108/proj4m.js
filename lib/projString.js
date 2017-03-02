import Proj from './proj'

export default function (code) {
  const paramObj = code.split('+').map(v => v.trim()).filter(a => a).reduce((p, a) => {
    const split = a.split('=')
    split.push(true)
    p[split[0].toLowerCase()] = split[1]
    return p
  }, {})
  return new Proj(paramObj.proj, paramObj.datum, code)
}
