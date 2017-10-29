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
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 1))
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
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
      /* 1 */
      /***/ function(module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })

        exports['default'] = function(context) {
          // enabled listening to all the actions
          AppController.sharedInstance()
            .pluginManager()
            .setWilcardsEnabled(true)

          var webUI = new _sketchModuleWebView2['default'](
            context,
            __webpack_require__(2),
            {
              identifier: _debugger.identifier,
              x: 0,
              y: 0,
              width: 1000,
              height: 700,
              blurredBackground: true,
              onlyShowCloseButton: true,
              hideTitleBar: false,
              shouldKeepAround: true,
              resizable: true,
              onPanelClose: (function() {
                function onPanelClose() {
                  AppController.sharedInstance()
                    .pluginManager()
                    .setWilcardsEnabled(false)
                }

                return onPanelClose
              })(),

              handlers: {
                getSketchState: (function() {
                  function getSketchState() {
                    var state = (0, _getSketchState3['default'])()

                    webUI.eval(
                      'sketchBridge(' +
                        String(
                          JSON.stringify({
                            name: _sharedActions.SET_TREE,
                            payload: state,
                          })
                        ) +
                        ')'
                    )
                  }

                  return getSketchState
                })(),
                getPageMetadata: (function() {
                  function getPageMetadata(pageId) {
                    var state = (0, _getSketchState2.getPageMetadata)(pageId)

                    webUI.eval(
                      'sketchBridge(' +
                        String(
                          JSON.stringify({
                            name: _sharedActions.SET_PAGE_METADATA,
                            payload: { pageId: pageId, state: state },
                          })
                        ) +
                        ')'
                    )
                  }

                  return getPageMetadata
                })(),
                getLayerMetadata: (function() {
                  function getLayerMetadata(layerId, pageId) {
                    var state = (0, _getSketchState2.getLayerMetadata)(
                      layerId,
                      pageId
                    )

                    webUI.eval(
                      'sketchBridge(' +
                        String(
                          JSON.stringify({
                            name: _sharedActions.SET_LAYER_METADATA,
                            payload: {
                              layerId: layerId,
                              pageId: pageId,
                              state: state,
                            },
                          })
                        ) +
                        ')'
                    )
                  }

                  return getLayerMetadata
                })(),
              },
            }
          )
        }

        var _sketchModuleWebView = __webpack_require__(3)

        var _sketchModuleWebView2 = _interopRequireDefault(_sketchModuleWebView)

        var _getSketchState2 = __webpack_require__(6)

        var _getSketchState3 = _interopRequireDefault(_getSketchState2)

        var _sharedActions = __webpack_require__(7)

        var _debugger = __webpack_require__(0)

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : { default: obj }
        }

        /***/
      },
      /* 2 */
      /***/ function(module, exports) {
        module.exports =
          'file://' +
          context.plugin
            .urlForResourceNamed(
              '_webpack_resources/a0c880c0cb96cba5fd60ad13efe3e9d5.html'
            )
            .path()

        /***/
      },
      /* 3 */
      /***/ function(module, exports, __webpack_require__) {
        /* globals NSUUID NSThread NSPanel NSMakeRect NSTexturedBackgroundWindowMask NSTitledWindowMask NSWindowTitleHidden NSClosableWindowMask NSColor NSWindowMiniaturizeButton NSWindowZoomButton NSFloatingWindowLevel WebView COScript NSWindowCloseButton NSFullSizeContentViewWindowMask NSVisualEffectView NSAppearance NSAppearanceNameVibrantLight NSVisualEffectBlendingModeBehindWindow */
        var MochaJSDelegate = __webpack_require__(4)
        var parseQuery = __webpack_require__(5)

        var coScript = COScript.currentCOScript()

        var LOCATION_CHANGED = 'webView:didChangeLocationWithinPageForFrame:'

        function addEdgeConstraint(edge, subview, view, constant) {
          view.addConstraint(
            NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
              subview,
              edge,
              NSLayoutRelationEqual,
              view,
              edge,
              1,
              constant
            )
          )
        }
        function fitSubviewToView(subview, view, constants) {
          subview.setTranslatesAutoresizingMaskIntoConstraints(false)

          addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0])
          addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1])
          addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2])
          addEdgeConstraint(
            NSLayoutAttributeBottom,
            subview,
            view,
            constants[3]
          )
        }

        function WebUI(context, frameLocation, options) {
          options = options || {}
          var identifier = options.identifier || NSUUID.UUID().UUIDString()
          var threadDictionary = NSThread.mainThread().threadDictionary()

          var panel
          var webView

          // if we already have a panel opened, reuse it
          if (threadDictionary[identifier]) {
            panel = threadDictionary[identifier]
            panel.makeKeyAndOrderFront(null)

            var subviews = panel.contentView().subviews()
            for (var i = 0; i < subviews.length; i++) {
              if (subviews[i].isKindOfClass(WebView.class())) {
                webView = subviews[i]
              }
            }

            if (!webView) {
              throw new Error(
                "Tried to reuse panel but couldn't find the webview inside"
              )
            }

            return {
              panel: panel,
              eval: webView.stringByEvaluatingJavaScriptFromString,
              webView: webView,
            }
          }

          panel = NSPanel.alloc().init()

          // Window size
          var panelWidth = options.width || 240
          var panelHeight = options.height || 180
          panel.setFrame_display(
            NSMakeRect(options.x || 0, options.y || 0, panelWidth, panelHeight),
            true
          )

          // Titlebar
          panel.setTitle(options.title || context.plugin.name())
          if (options.hideTitleBar) {
            panel.setTitlebarAppearsTransparent(true)
            panel.setTitleVisibility(NSWindowTitleHidden)
          }

          // Hide minize and zoom buttons
          if (options.onlyShowCloseButton) {
            panel
              .standardWindowButton(NSWindowMiniaturizeButton)
              .setHidden(true)
            panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
          }

          // Close window callback
          var closeButton = panel.standardWindowButton(NSWindowCloseButton)
          closeButton.setCOSJSTargetFunction(function(sender) {
            if (options.onPanelClose) {
              var result = options.onPanelClose()
              if (result === false) {
                return
              }
            }
            panel.close()
            threadDictionary.removeObjectForKey(options.identifier)
            COScript.currentCOScript().setShouldKeepAround(false)
          })
          closeButton.setAction('callAction:')

          panel.setStyleMask(
            options.styleMask ||
              (options.resizable
                ? NSTexturedBackgroundWindowMask |
                  NSTitledWindowMask |
                  NSResizableWindowMask |
                  NSClosableWindowMask |
                  NSFullSizeContentViewWindowMask
                : NSTexturedBackgroundWindowMask |
                  NSTitledWindowMask |
                  NSClosableWindowMask |
                  NSFullSizeContentViewWindowMask)
          )
          panel.becomeKeyWindow()
          panel.setLevel(NSFloatingWindowLevel)

          // Appearance
          var backgroundColor = options.background || NSColor.whiteColor()
          panel.setBackgroundColor(backgroundColor)
          if (options.blurredBackground) {
            var vibrancy = NSVisualEffectView.alloc().initWithFrame(
              NSMakeRect(0, 0, panelWidth, panelHeight)
            )
            vibrancy.setAppearance(
              NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight)
            )
            vibrancy.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)

            // Add it to the panel
            panel.contentView().addSubview(vibrancy)
            fitSubviewToView(vibrancy, panel.contentView(), [0, 0, 0, 0])
          }

          threadDictionary[identifier] = panel

          if (options.shouldKeepAround !== false) {
            // Long-running script
            coScript.setShouldKeepAround(true)
          }

          // Add Web View to window
          webView = WebView.alloc().initWithFrame(
            NSMakeRect(
              0,
              options.hideTitleBar ? -24 : 0,
              options.width || 240,
              (options.height || 180) - (options.hideTitleBar ? 0 : 24)
            )
          )

          if (options.frameLoadDelegate || options.handlers) {
            var handlers = options.frameLoadDelegate || {}
            if (options.handlers) {
              var lastQueryId
              handlers[LOCATION_CHANGED] = function(webview, frame) {
                var query = webview
                  .windowScriptObject()
                  .evaluateWebScript('window.location.hash')
                query = parseQuery(query)
                if (
                  query.pluginAction &&
                  query.actionId &&
                  query.actionId !== lastQueryId &&
                  query.pluginAction in options.handlers
                ) {
                  lastQueryId = query.actionId
                  try {
                    query.pluginArgs = JSON.parse(query.pluginArgs)
                  } catch (err) {}
                  options.handlers[query.pluginAction].apply(
                    context,
                    query.pluginArgs
                  )
                }
              }
            }
            var frameLoadDelegate = new MochaJSDelegate(handlers)
            webView.setFrameLoadDelegate_(frameLoadDelegate.getClassInstance())
          }
          if (options.uiDelegate) {
            var uiDelegate = new MochaJSDelegate(options.uiDelegate)
            webView.setUIDelegate_(uiDelegate.getClassInstance())
          }

          if (!options.blurredBackground) {
            webView.setOpaque(true)
            webView.setBackgroundColor(backgroundColor)
          } else {
            // Prevent it from drawing a white background
            webView.setDrawsBackground(false)
          }

          // When frameLocation is a file, prefix it with the Sketch Resources path
          if (/^(?!http|localhost|www|file).*\.html?$/.test(frameLocation)) {
            frameLocation = context.plugin
              .urlForResourceNamed(frameLocation)
              .path()
          }
          webView.setMainFrameURL_(frameLocation)

          panel.contentView().addSubview(webView)
          fitSubviewToView(webView, panel.contentView(), [
            0,
            options.hideTitleBar ? -24 : 0,
            0,
            0,
          ])

          panel.center()
          panel.makeKeyAndOrderFront(null)

          return {
            panel: panel,
            eval: webView.stringByEvaluatingJavaScriptFromString,
            webView: webView,
          }
        }

        WebUI.clean = function() {
          coScript.setShouldKeepAround(false)
        }

        module.exports = WebUI

        /***/
      },
      /* 4 */
      /***/ function(module, exports) {
        /* globals NSUUID MOClassDescription NSObject NSSelectorFromString NSClassFromString */

        module.exports = function(selectorHandlerDict, superclass) {
          var uniqueClassName =
            'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

          var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(
            uniqueClassName,
            superclass || NSObject
          )

          delegateClassDesc.registerClass()

          // Storage Handlers
          var handlers = {}

          // Define interface
          this.setHandlerForSelector = function(selectorString, func) {
            var handlerHasBeenSet = selectorString in handlers
            var selector = NSSelectorFromString(selectorString)

            handlers[selectorString] = func

            /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
            if (!handlerHasBeenSet) {
              var args = []
              var regex = /:/g
              while (regex.exec(selectorString)) {
                args.push('arg' + args.length)
              }

              var dynamicFunction = eval(
                '(function (' +
                  args.join(', ') +
                  ') { return handlers[selectorString].apply(this, arguments); })'
              )

              delegateClassDesc.addInstanceMethodWithSelector_function_(
                selector,
                dynamicFunction
              )
            }
          }

          this.removeHandlerForSelector = function(selectorString) {
            delete handlers[selectorString]
          }

          this.getHandlerForSelector = function(selectorString) {
            return handlers[selectorString]
          }

          this.getAllHandlers = function() {
            return handlers
          }

          this.getClass = function() {
            return NSClassFromString(uniqueClassName)
          }

          this.getClassInstance = function() {
            return NSClassFromString(uniqueClassName).new()
          }

          // Convenience
          if (typeof selectorHandlerDict === 'object') {
            for (var selectorString in selectorHandlerDict) {
              this.setHandlerForSelector(
                selectorString,
                selectorHandlerDict[selectorString]
              )
            }
          }
        }

        /***/
      },
      /* 5 */
      /***/ function(module, exports) {
        module.exports = function(query) {
          query = query.split('?')[1]
          if (!query) {
            return
          }
          query = query.split('&').reduce(function(prev, s) {
            var res = s.split('=')
            if (res.length === 2) {
              prev[decodeURIComponent(res[0])] = decodeURIComponent(res[1])
            }
            return prev
          }, {})
          return query
        }

        /***/
      },
      /* 6 */
      /***/ function(module, exports, __webpack_require__) {
        Object.defineProperty(exports, '__esModule', {
          value: true,
        })
        exports.getPageMetadata = getPageMetadata
        exports.getLayerMetadata = getLayerMetadata
        exports['default'] = getElementTree

        var _debugger = __webpack_require__(0)

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

        function getMSWindow() {
          return toArray(NSApp.windows()).filter(function(win) {
            return win.isKindOfClass(MSDocumentWindow)
          })
        }

        function getLayerChildren(layer, pageId) {
          if (!layer.children) {
            return []
          }
          var children = toArray(layer.children()).filter(function(child) {
            return child.objectID() !== layer.objectID()
          })
          return children.map(inspectLayer.bind(this, pageId))
        }

        function inspectLayer(pageId, layer, index) {
          return {
            type: 'layer',
            index: index,
            id: String(layer.objectID()),
            desc: String(layer.description()),
            class: String(layer['class']()),
            name: String(layer.name()),
            fromPage: pageId,
            children: getLayerChildren(layer, pageId),
          }
        }

        function getPageLayers(page, pageId) {
          return toArray(page.layers()).map(inspectLayer.bind(this, pageId))
        }

        function getDocumentPages(doc) {
          return toArray(doc.pages()).map(function(page, index) {
            var pageId = String(page.objectID())
            return {
              type: 'page',
              index: index,
              id: pageId,
              desc: String(page.description()),
              class: String(page['class']()),
              name: String(page.name()),
              children: getPageLayers(page, pageId),
            }
          })
        }

        function getWindowDocument(win) {
          if (win.isKindOfClass(MSDocumentWindow) && win.document()) {
            return [
              {
                type: 'document',
                index: 0,
                id: '?',
                desc: String(win.document().description()),
                class: String(win.document()['class']()),
                meta: {},
                children: getDocumentPages(win.document()),
              },
            ]
          }
          return []
        }

        function findPageById(pageId) {
          var windows = getMSWindow()
          var page = void 0
          windows.forEach(function(win) {
            if (!win.document()) {
              return
            }
            var pages = toArray(win.document().pages())
            pages.forEach(function(p) {
              if (String(p.objectID()) === pageId) {
                page = p
              }
            })
          })

          return page
        }

        function getPageMetadata(pageId) {
          var page = findPageById(pageId)

          if (!page) {
            return undefined
          }

          var dict = page.treeAsDictionary()
          delete dict.layers
          delete dict['<class>']
          delete dict.name

          return (0, _debugger.prepareObjectDeep)(dict, true)
        }

        function getLayerMetadata(layerId, pageId) {
          var page = findPageById(pageId)

          if (!page) {
            return undefined
          }

          var predicate = NSPredicate.predicateWithFormat(
            'objectID CONTAINS[c] %@',
            layerId
          )
          var result = toArray(
            page.children().filteredArrayUsingPredicate(predicate)
          )

          if (!result || !result.length) {
            return undefined
          }

          var dict = result[0].treeAsDictionary()
          delete dict.children
          delete dict.layers
          delete dict['<class>']
          delete dict.name

          return (0, _debugger.prepareObjectDeep)(dict, true)
        }

        function getElementTree() {
          var windows = getMSWindow()
          return windows.map(function(win, index) {
            return {
              type: 'window',
              index: index,
              id: '?',
              desc: String(win.description()),
              class: String(win['class']()),
              name: String(win.title()),
              children: getWindowDocument(win),
            }
          })
        }

        /***/
      },
      /* 7 */
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
that['onRun'] = run.bind(this, 'default')
