// Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
function shallowDiffers (a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) {
    if (a[i] !== b[i]) {
      console.log(i + ' is not equal', 'value a: ', a[i], 'value b: ', b[i])
      return true
    }
  }
  return false
}

export default (instance, nextProps, nextState) => {
  let propsDiffers = shallowDiffers(instance.props, nextProps)
  console.log('propsDiffers', propsDiffers)
  const stateDiffers = shallowDiffers(instance.state, nextState)
  console.log('stateDiffers', stateDiffers)
  return (propsDiffers || stateDiffers)
}
