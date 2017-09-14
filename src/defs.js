import globals from './globals'
import parseProj from './projString'

function defs (name) {
  name = name ? name.toUpperCase() : ''
  if (arguments.length === 2) {
    const def = arguments[1]
    if (typeof def === 'string') {
      defs[name] = parseProj(def)
    } else {
      defs[name] = def
    }
  } else if (arguments.length === 1) {
    if (typeof name === 'string') {
      if (name in defs) {
        return defs[name]
      }
    } else {
      console.log(name)
    }
  }
}

globals(defs)
export default defs
