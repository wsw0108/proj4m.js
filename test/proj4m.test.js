const assert = require('assert')
const proj4m = require('../dist/proj4m')

describe('proj4m', () => {
  it('EPSG:4326 -> EPSG:3857', () => {
    const tolerance = 1e-3
    const input = [120.0, 30.0]
    const output = proj4m('EPSG:4326', 'EPSG:3857', input)
    assert(Math.abs(output[0] - 13358338.895192828) <= tolerance)
    assert(Math.abs(output[1] - 3503549.843504374) <= tolerance)
  })

  it('GCJ02 -> GCJ02', () => {
    const tolerance = 0.0
    const input = [121.8999, 21.333]
    const output = proj4m('GCJ02', 'GCJ02', input)
    assert(Math.abs(output[0] - input[0]) <= tolerance)
    assert(Math.abs(output[1] - input[1]) <= tolerance)
  })

  it('GCJ02 -> BD09', () => {
    const tolerance = 1e-7
    const expected = [
      [114.69490414027017, 33.639096507711685],
      [114.69488614273101, 33.63804850387785],
      [114.69500713986416, 33.63794251496537],
      [114.69578412001135, 33.63793958798685],
      [114.6959281162725, 33.637965601694006],
      [114.69751307493384, 33.637957753486745]
    ]
    const coords = [
      [114.68837663801743, 33.63312016454496],
      [114.68835840204522, 33.632072446353945],
      [114.68848002806972, 33.63196427051657],
      [114.68926112541861, 33.63194729708501],
      [114.68940588838505, 33.6319707051534],
      [114.69099925796665, 33.63193416046613]
    ]
    const proj4 = proj4m('GCJ02', 'BD09LL')
    const output = []
    for (let i = 0; i < coords.length; i++) {
      output.push(proj4.forward(coords[i]))
    }
    for (let i = 0; i < expected.length; i++) {
      assert(Math.abs(output[i][0] - expected[i][0] <= tolerance))
      assert(Math.abs(output[i][1] - expected[i][1] <= tolerance))
    }
  })
})
