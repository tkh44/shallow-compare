module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'shallowCompare',
      externals: {
        react: 'React'
      }
    }
  }
}
