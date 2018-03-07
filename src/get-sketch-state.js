/* globals NSApp MSDocumentWindow NSPredicate */
import { toArray, prepareObject } from 'sketch-utils'

function getMSWindow() {
  return toArray(NSApp.windows()).filter(win =>
    win.isKindOfClass(MSDocumentWindow)
  )
}

function getLayerChildren(layer, pageId) {
  if (!layer.children) {
    return []
  }
  const children = toArray(layer.children()).filter(
    child => child.objectID() !== layer.objectID()
  )
  // eslint-disable-next-line
  return children.map(inspectLayer.bind(this, pageId))
}

function inspectLayer(pageId, layer, index) {
  return {
    type: 'layer',
    index,
    id: String(layer.objectID()),
    desc: String(layer.description()),
    class: String(layer.class()),
    name: String(layer.name()),
    fromPage: pageId,
  }
}

function getPageLayers(page, pageId) {
  return toArray(page.layers()).map(inspectLayer.bind(this, pageId))
}

function getDocumentPages(doc) {
  return toArray(doc.pages()).map((page, index) => {
    const pageId = String(page.objectID())
    return {
      type: 'page',
      index,
      id: pageId,
      desc: String(page.description()),
      class: String(page.class()),
      name: String(page.name()),
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
        class: String(win.document().class()),
        meta: {},
        children: getDocumentPages(win.document()),
      },
    ]
  }
  return []
}

function findPageById(pageId) {
  const windows = getMSWindow()
  let page
  windows.forEach(win => {
    if (!win.document()) {
      return
    }
    const pages = toArray(win.document().pages())
    pages.forEach(p => {
      if (String(p.objectID()) === pageId) {
        page = p
      }
    })
  })

  return page
}

export function getPageMetadata(pageId) {
  const page = findPageById(pageId)

  if (!page) {
    return undefined
  }

  const dict = page.treeAsDictionary()
  delete dict.layers
  delete dict['<class>']
  delete dict.name

  return {
    meta: prepareObject(dict, {
      skipMocha: true,
    }),
    children: getPageLayers(page, pageId),
  }
}

export function getLayerMetadata(layerId, pageId) {
  const page = findPageById(pageId)

  if (!page) {
    return undefined
  }

  const predicate = NSPredicate.predicateWithFormat(
    'objectID CONTAINS[c] %@',
    layerId
  )
  const result = toArray(page.children().filteredArrayUsingPredicate(predicate))

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
    children: getLayerChildren(layer, pageId),
  }
}

export default function getElementTree() {
  const windows = getMSWindow()
  return windows.map((win, index) => ({
    type: 'window',
    index,
    id: '?',
    desc: String(win.description()),
    class: String(win.class()),
    name: String(win.title()),
    children: getWindowDocument(win),
  }))
}
