import defs from './defs'
import projStr from './projString'

function testObj (code) {
  return typeof code === 'string'
}

function testDef (code) {
  return code in defs
}

function testProj (code) {
  return code[0] === '+'
}

function parse (code) {
  if (testObj(code)) {
    if (testDef(code)) {
      return defs[code]
    }
    if (testProj(code)) {
      return projStr(code)
    }
  } else {
    return code
  }
}

export default parse
