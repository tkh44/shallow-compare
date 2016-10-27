import babel from 'rollup-plugin-babel'

export default {
  plugins: [
    babel({
      babelrc: false,
      sourceMap: true,
      exclude: 'node_modules/**',
      presets: [
        'stage-0',
        'es2015-minimal-rollup'
      ]
    })
  ]
}
