/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names */
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

function prepareArrayDeep(array, skipMocha) {
  return array.map(function(i) {
    return module.exports.prepareValue(i, skipMocha)
  })
}

module.exports.prepareObjectDeep = function(object, skipMocha) {
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
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArrayDeep(value, skipMocha)
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
        value = module.exports.prepareObjectDeep(Object(value), skipMocha)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM'
      ) {
        primitive = 'Array'
        value = prepareArrayDeep(toArray(value), skipMocha)
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
      value = module.exports.prepareObjectDeep(value, skipMocha)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
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
