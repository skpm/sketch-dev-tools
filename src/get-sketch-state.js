/* globals NSPredicate */
import sketch from 'sketch/dom' // eslint-disable-line
import { toArray, prepareObject } from 'sketch-utils'

function getLayerChildren(layer, pageId, docId) {
  if (!layer.children) {
    return []
  }
  const children = toArray(layer.children()).filter(
    child => child.objectID() !== layer.objectID()
  )
  // eslint-disable-next-line
  return children.map(inspectLayer.bind(this, pageId, docId))
}

function inspectLayer(pageId, docId, layer, index) {
  return {
    type: 'layer',
    index,
    id: String(layer.objectID()),
    desc: String(layer.description()),
    class: String(layer.class()),
    name: String(layer.name()),
    fromPage: pageId,
    fromDoc: docId,
  }
}

function getPageLayers(page, docId) {
  return page.layers.map(layer =>
    inspectLayer(page.id, docId, layer.sketchObject)
  )
}

function getDocumentPages(doc) {
  return doc.pages.map((page, index) => ({
    type: page.type,
    index,
    id: page.id,
    desc: String(page.sketchObject.description()),
    class: String(page.sketchObject.class()),
    name: page.name,
    fromDoc: doc.id,
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

export function getPageMetadata(pageId, docId) {
  const page = findPageById(pageId, docId)

  if (!page) {
    return undefined
  }

  const dict = page.sketchObject.treeAsDictionary()
  delete dict.layers
  delete dict['<class>']
  delete dict.name

  return {
    meta: prepareObject(dict, {
      skipMocha: true,
    }),
    children: getPageLayers(page, docId),
  }
}

export function getLayerMetadata(layerId, pageId, docId) {
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

  const layer = result[0]

  const dict = layer.treeAsDictionary()
  delete dict.children
  delete dict.layers
  delete dict['<class>']
  delete dict.name

  return {
    meta: prepareObject(dict, {
      skipMocha: true,
    }),
    children: getLayerChildren(layer, pageId, docId),
  }
}

export default function getElementTree() {
  const documents = sketch.Document.getDocuments()
  return documents.map((doc, index) => ({
    type: doc.type,
    index,
    id: doc.id,
    desc: String(doc.sketchObject.description()),
    class: String(doc.sketchObject.class()),
    meta: {},
    children: getDocumentPages(doc),
  }))
}
