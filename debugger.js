/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var remoteWebview = require('sketch-module-web-view/remote')

module.exports.identifier = 'skpm.debugger'

function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  const arr = []
  for (let j = 0; j < object.count(); j += 1) {
    arr.push(object.objectAtIndex(j))
  }
  return arr
}

module.exports.prepareStackTrace = function(stackTrace) {
  var stack = stackTrace.split('\n')
  stack = stack.map(s => s.replace(/\sg/, ''))

  // pop the last 2 frames as it's ours here
  stack.splice(0, 2)

  stack = stack.map(function(entry) {
    var line = null
    var column = null
    var file = null
    var split = entry.split('@')
    var fn = split[0]
    var filePath = split[1]

    if (filePath) {
      split = filePath.split(':')
      filePath = split[0]
      line = split[1]
      column = split[2]
      file = filePath.split('/')
      file = file[file.length - 1]
    }
    return {
      fn: fn,
      file: file,
      filePath: filePath,
      line: line,
      column: column,
    }
  })

  return stack
}

function prepareArray(array, skipMocha) {
  return array.map(function(i) {
    return module.exports.prepareValue(i, skipMocha)
  })
}

module.exports.prepareObject = function(object, skipMocha) {
  const deep = {}
  Object.keys(object).forEach(key => {
    deep[key] = module.exports.prepareValue(object[key], skipMocha)
  })
  return deep
}

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(value) {
  var mocha = value.class().mocha()
  var introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.propertiesWithAncestors()).map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.classMethodsWithAncestors()).map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.instanceMethodsWithAncestors()).map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(mocha.protocolsWithAncestors()).map(getName),
    },
  }
  // if (mocha.treeAsDictionary) {
  //   introspection.treeAsDictionary = mocha.treeAsDictionary()
  // }
  return introspection
}

module.exports.prepareValue = function prepareValue(value, skipMocha) {
  let type = 'String'
  let primitive = 'String'
  const typeOf = typeof value
  if (value instanceof Error) {
    type = 'Error'
    primitive = 'Error'
    value = {
      message: value.message,
      name: value.name,
      stack: module.exports.prepareStackTrace(value.stack),
    }
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArray(value, skipMocha)
  } else if (value === null || value === undefined || Number.isNaN(value)) {
    type = 'Empty'
    primitive = 'Empty'
    value = String(value)
  } else if (typeOf === 'object') {
    if (value.isKindOfClass && typeof value.class === 'function') {
      type = String(value.class())
      // TODO: Here could come some meta data saved as value
      if (
        type === 'NSDictionary' ||
        type === '__NSDictionaryM' ||
        type === '__NSSingleEntryDictionaryI' ||
        type === '__NSDictionaryI' ||
        type === '__NSCFDictionary'
      ) {
        primitive = 'Object'
        value = module.exports.prepareObject(Object(value), skipMocha)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM' ||
        type === '__NSSingleObjectArrayI' ||
        type === '__NSArray0'
      ) {
        primitive = 'Array'
        value = prepareArray(toArray(value), skipMocha)
      } else if (
        type === 'NSString' ||
        type === '__NSCFString' ||
        type === 'NSTaggedPointerString' ||
        type === '__NSCFConstantString'
      ) {
        primitive = 'String'
        value = String(value)
      } else if (type === '__NSCFNumber' || type === 'NSNumber') {
        primitive = 'Number'
        value = 0 + value
      } else if (type === 'MOStruct') {
        type = String(value.name())
        primitive = 'Object'
        value = value.memberNames().reduce(function(prev, k) {
          prev[k] = module.exports.prepareValue(value[k], skipMocha)
          return prev
        }, {})
      } else if (value.class().mocha && !skipMocha) {
        primitive = 'Mocha'
        value = introspectMochaObject(value)
      } else {
        primitive = 'Unknown'
        value = type
      }
    } else {
      type = 'Object'
      primitive = 'Object'
      value = module.exports.prepareObject(value, skipMocha)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
    value = String(value)
  } else if (value === true || value === false) {
    type = 'Boolean'
    primitive = 'Boolean'
  } else if (typeOf === 'number') {
    primitive = 'Number'
    type = 'Number'
  }

  return { value, type, primitive }
}

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview.sendToWebview(
    module.exports.identifier,
    'sketchBridge(' + JSON.stringify({ name, payload }) + ');'
  )
}
