function identity (p) {
  return p
}

export default {
  forward: identity,
  inverse: identity,
  isLatLong: true
}
