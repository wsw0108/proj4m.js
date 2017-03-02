import buble from 'rollup-plugin-buble'

const pkg = require('./package.json')

export default {
  entry: 'src/index.js',
  plugins: [buble()],
  external: ['proj4'],
  targets: [
    {
      format: 'cjs',
      dest: pkg.main
    },
    {
      format: 'es',
      dest: pkg.module
    }
  ]
}
