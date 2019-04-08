/* globals NSPredicate */
import sketch from 'sketch/dom'
import { toArray, prepareObject } from 'sketch-utils'

function toJSONWithoutKeys(object, keys) {
  const properties = {}
  keys.forEach(key => {
    properties[key] = sketch[object.type]._DefinedPropertiesKey[key]
    delete sketch[object.type]._DefinedPropertiesKey[key]
  })

  const json = object.toJSON()

  keys.forEach(key => {
    sketch[object.type]._DefinedPropertiesKey[key] = properties[key]
  })

  return json
}

function inspectLayer(pageId, docId, options, layer, index) {
  const nativeLayer = layer.sketchObject
  return {
    type: 'layer',
    index,
    id: String(nativeLayer.objectID()),
    class: options && options.native ? String(nativeLayer.class()) : layer.type,
    name: String(nativeLayer.name()),
    fromPage: pageId,
    fromDoc: docId,
    hasChildren: nativeLayer.layers && nativeLayer.layers().length > 0,
  }
}

function getLayerChildren(layer, pageId, docId, options) {
  if (!layer.children) {
    return []
  }
  const children = toArray(layer.childrenIncludingSelf(false)).map(x =>
    sketch.fromNative(x)
  )

  return children.map(inspectLayer.bind(this, pageId, docId, options))
}

function getPageLayers(page, docId, options) {
  return page.layers.map(inspectLayer.bind(this, page.id, docId, options))
}

function getDocumentPages(doc, options) {
  return doc.pages.map((page, index) => ({
    type: page.type,
    index,
    id: page.id,
    class:
      options && options.native ? String(page.sketchObject.class()) : page.type,
    name: page.name,
    fromDoc: doc.id,
    hasChildren:
      page.sketchObject.layers && page.sketchObject.layers().length > 0,
  }))
}

function findPageById(pageId, docId) {
  const documents = sketch.Document.getDocuments()
  let page
  documents.forEach(doc => {
    if (page || doc.id !== docId) {
      return
    }
    doc.pages.forEach(p => {
      if (page) {
        return
      }
      if (p.id === pageId) {
        page = p
      }
    })
  })

  return page
}

export function getPageMetadata(pageId, docId, options) {
  const page = findPageById(pageId, docId)

  if (!page) {
    return undefined
  }

  let dict

  if (options && options.native) {
    dict = page.sketchObject.treeAsDictionary()
    delete dict.layers
    delete dict['<class>']
    delete dict.name
  } else {
    dict = toJSONWithoutKeys(page, ['name', 'layers'])
    delete dict.layers
    delete dict.name
  }

  return {
    meta: prepareObject(dict, {
      skipMocha: true,
    }),
    children: getPageLayers(page, docId, options),
  }
}

export function getLayerMetadata(layerId, pageId, docId, options) {
  const page = findPageById(pageId, docId)

  if (!page) {
    return undefined
  }

  const predicate = NSPredicate.predicateWithFormat(
    'objectID CONTAINS[c] %@',
    layerId
  )
  const result = toArray(
    page.sketchObject.children().filteredArrayUsingPredicate(predicate)
  )

  if (!result || !result.length) {
    return undefined
  }

  const nativeLayer = result[0]

  let dict

  if (options && options.native) {
    dict = nativeLayer.treeAsDictionary()
    delete dict.children
    delete dict.layers
    delete dict['<class>']
    delete dict.name
  } else {
    const layer = sketch.fromNative(nativeLayer)
    dict = toJSONWithoutKeys(layer, ['name', 'layers'])
    delete dict.layers
    delete dict.name
  }

  return {
    meta: prepareObject(dict, {
      skipMocha: true,
    }),
    children: getLayerChildren(nativeLayer, pageId, docId, options),
  }
}

export default function getElementTree(options) {
  const documents = sketch.Document.getDocuments()
  return documents.map((doc, index) => {
    const children = getDocumentPages(doc, options)
    const name = decodeURIComponent((doc.path || '').split('/').pop())

    const dict = {
      type: doc.type,
      index,
      id: doc.id,
      hasChildren: children.length > 0,
      children,
      name,
    }

    let meta
    if (options && options.native) {
      dict.class = String(doc.sketchObject.class())
      meta = doc.sketchObject.documentData().treeAsDictionary()
      delete meta.pages
      delete meta['<class>']
    } else {
      dict.class = doc.type
      meta = toJSONWithoutKeys(doc, ['name', 'pages'])
    }

    dict.meta = prepareObject(meta, {
      skipMocha: true,
    })
    return dict
  })
}
