export default function(context) {
  console.log('test log')
  console.info('test info')
  console.warn('test warn')
  console.error('test error')
  console.log('test multiple arguments', 'second argument')
  console.group()
  console.log(undefined)
  console.log(null)
  console.log(NaN)
  console.groupEnd()
  console.log({
    test: 'object',
  })
  console.log([1, 2, 3])
  console.log(42)
  console.log(context.document)
  console.log(new Error('error test'))
  log('test from a normal log') // eslint-disable-line
  throw new Error('test throwing an error')
}
