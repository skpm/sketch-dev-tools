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
        /* WEBPACK VAR INJECTION */ ;(function(console) {
          Object.defineProperty(exports, '__esModule', {
            value: true,
          })

          exports['default'] = function(context) {
            console.log('test log')
            console.info('test info')
            console.warn('test warn')
            console.error('test error')
            console.log('test multiple arguments', 'second argument')
            console.log({
              test: 'object',
            })
            console.log([1, 2, 3])
            console.log(42)
            console.log(context.document)
          }
          /* WEBPACK VAR INJECTION */
        }.call(exports, __webpack_require__(1)))

        /***/
      },
      /* 1 */
      /***/ function(module, exports, __webpack_require__) {
        /* WEBPACK VAR INJECTION */ ;(function(global) {
          /* globals log */

          var console = {
            log: log,
            warn: log,
            error: log,
            dump: function(obj) {
              log('###############################################')
              log('## Dumping object ' + obj)
              if (obj.className) {
                log('## obj class is: ' + obj.className())
              }
              log('###############################################')

              if (obj.class && obj.class().mocha) {
                log('obj.properties:')
                log(
                  obj
                    .class()
                    .mocha()
                    .properties()
                )
                log('obj.propertiesWithAncestors:')
                log(
                  obj
                    .class()
                    .mocha()
                    .propertiesWithAncestors()
                )

                log('obj.classMethods:')
                log(
                  obj
                    .class()
                    .mocha()
                    .classMethods()
                )
                log('obj.classMethodsWithAncestors:')
                log(
                  obj
                    .class()
                    .mocha()
                    .classMethodsWithAncestors()
                )

                log('obj.instanceMethods:')
                log(
                  obj
                    .class()
                    .mocha()
                    .instanceMethods()
                )
                log('obj.instanceMethodsWithAncestors:')
                log(
                  obj
                    .class()
                    .mocha()
                    .instanceMethodsWithAncestors()
                )

                log('obj.protocols:')
                log(
                  obj
                    .class()
                    .mocha()
                    .protocols()
                )
                log('obj.protocolsWithAncestors:')
                log(
                  obj
                    .class()
                    .mocha()
                    .protocolsWithAncestors()
                )
              }

              if (obj.treeAsDictionary) {
                log('obj.treeAsDictionary():')
                log(obj.treeAsDictionary())
              }
            },
          }

          // polyfill the global object
          var commonjsGlobal = typeof global !== 'undefined' ? global : this

          commonjsGlobal.console = commonjsGlobal.console || console

          module.exports = console

          /* WEBPACK VAR INJECTION */
        }.call(exports, __webpack_require__(2)))

        /***/
      },
      /* 2 */
      /***/ function(module, exports) {
        var g

        // This works in non-strict mode
        g = (function() {
          return this
        })()

        try {
          // This works if eval is allowed (see CSP)
          g = g || Function('return this')() || (1, eval)('this')
        } catch (e) {
          // This works if the window reference is available
          if (typeof window === 'object') g = window
        }

        // g can still be undefined, but nothing to do about it...
        // We return undefined, instead of nothing here, so it's
        // easier to handle this case. if(!global) { ...}

        module.exports = g

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
that['onRun'] = run.bind(this, 'default')
