var that = this
function run(key, context) {
  that.context = context

  var exports = /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {} // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }) // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ) // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true // Return the exports of the module
      /******/
      /******/ /******/ return module.exports
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          /******/ configurable: false,
          /******/ enumerable: true,
          /******/ get: getter,
          /******/
        })
        /******/
      }
      /******/
    } // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default']
            }
          : /******/ function getModuleExports() {
              return module
            }
      /******/ __webpack_require__.d(getter, 'a', getter)
      /******/ return getter
      /******/
    } // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property)
    } // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 0))
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function(module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.onAction = onAction

        var _debugger = __webpack_require__(1)

        var _sharedActions = __webpack_require__(2)

        // eslint-disable-next-line
        function onAction(context) {
          return (0, _debugger.sendToDebugger)(_sharedActions.ADD_ACTION, {
            name: String(context.action),
            context: (0, _debugger.prepareValue)(context.actionContext),
          })
        }

        /***/
      },
      /* 1 */
      /***/ function(module, exports) {
        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function(obj) {
                return typeof obj
              }
            : function(obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? 'symbol'
                  : typeof obj
              }

        /* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template */
        module.exports.identifier = 'skpm.debugger'

        function toArray(object) {
          if (Array.isArray(object)) {
            return object
          }
          var arr = []
          for (var j = 0; j < object.count(); j += 1) {
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
          var deep = {}
          Object.keys(object).forEach(function(key) {
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
          var mocha = value['class']().mocha()
          var introspection = {
            properties: {
              type: 'Array',
              primitive: 'Array',
              value: toArray(mocha.propertiesWithAncestors()).map(getName),
            },
            classMethods: {
              type: 'Array',
              primitive: 'Array',
              value: toArray(mocha.classMethodsWithAncestors()).map(
                getSelector
              ),
            },
            instanceMethods: {
              type: 'Array',
              primitive: 'Array',
              value: toArray(mocha.instanceMethodsWithAncestors()).map(
                getSelector
              ),
            },
            protocols: {
              type: 'Array',
              primitive: 'Array',
              value: toArray(mocha.protocolsWithAncestors()).map(getName),
            },
            // if (mocha.treeAsDictionary) {
            //   introspection.treeAsDictionary = mocha.treeAsDictionary()
            // }
          }
          return introspection
        }

        module.exports.prepareValue = (function() {
          function prepareValue(value, skipMocha) {
            var type = 'String'
            var primitive = 'String'
            var typeOf =
              typeof value === 'undefined' ? 'undefined' : _typeof(value)
            if (value instanceof Error) {
              type = 'Error'
              primitive = 'Error'
            } else if (Array.isArray(value)) {
              type = 'Array'
              primitive = 'Array'
              value = prepareArrayDeep(value, skipMocha)
            } else if (typeOf === 'object') {
              if (value.isKindOfClass && typeof value['class'] === 'function') {
                type = String(value['class']())
                // TODO: Here could come some meta data saved as value
                if (
                  type === 'NSDictionary' ||
                  type === '__NSDictionaryM' ||
                  type === '__NSSingleEntryDictionaryI' ||
                  type === '__NSDictionaryI' ||
                  type === '__NSCFDictionary'
                ) {
                  primitive = 'Object'
                  value = module.exports.prepareObjectDeep(
                    Object(value),
                    skipMocha
                  )
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
                } else if (value['class']().mocha && !skipMocha) {
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
            } else if (
              value === null ||
              value === undefined ||
              Number.isNaN(value)
            ) {
              type = 'Empty'
              primitive = 'Empty'
            } else if (typeOf === 'number') {
              primitive = 'Number'
              type = 'Number'
            }

            return { value: value, type: type, primitive: primitive }
          }

          return prepareValue
        })()

        var threadDictionary = NSThread.mainThread().threadDictionary()

        module.exports.isDebuggerPresent = (function() {
          function isDebuggerPresent() {
            return !!threadDictionary[module.exports.identifier]
          }

          return isDebuggerPresent
        })()

        module.exports.sendToDebugger = (function() {
          function sendToDebugger(name, payload) {
            if (!module.exports.isDebuggerPresent()) {
              return false
            }

            var webview = threadDictionary[module.exports.identifier]
              .contentView()
              .subviews()
            webview = webview[webview.length - 1]

            return webview.stringByEvaluatingJavaScriptFromString(
              'sketchBridge(' +
                JSON.stringify({ name: name, payload: payload }) +
                ');'
            )
          }

          return sendToDebugger
        })()

        /***/
      },
      /* 2 */
      /***/ function(module, exports) {
        module.exports.SET_TREE = 'elements/SET_TREE'
        module.exports.SET_PAGE_METADATA = 'elements/SET_PAGE_METADATA'
        module.exports.SET_LAYER_METADATA = 'elements/SET_LAYER_METADATA'
        module.exports.ADD_LOG = 'logs/ADD_LOG'
        module.exports.CLEAR_LOGS = 'logs/CLEAR_LOGS'
        module.exports.ADD_REQUEST = 'network/ADD_REQUEST'
        module.exports.SET_RESPONSE = 'network/SET_RESPONSE'
        module.exports.ADD_ACTION = 'actions/ADD_ACTION'

        /***/
      },
      /******/
    ]
  )
  if (key === 'default' && typeof exports === 'function') {
    exports(context)
  } else {
    exports[key](context)
  }
}
that['onAction'] = run.bind(this, 'onAction')
that['onRun'] = run.bind(this, 'default')
