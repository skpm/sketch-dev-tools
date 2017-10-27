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

function getLayerChildren(layer) {
  if (!layer.children) {
    return []
  }
  const children = toArray(layer.children()).filter(
    child => child.objectID() !== layer.objectID()
  )
  return children.map(inspectLayer)
}

function inspectLayer(layer, index) {
  return {
    type: 'layer',
    index,
    id: String(layer.objectID()),
    desc: String(layer.description()),
    class: String(layer.class()),
    meta: {
      name: String(layer.name()),
    },
    children: getLayerChildren(layer),
  }
}

function getPageLayers(page) {
  return toArray(page.layers()).map(inspectLayer)
}

function getDocumentPages(doc) {
  return toArray(doc.pages()).map((page, index) => ({
    type: 'page',
    index,
    id: String(page.objectID()),
    desc: String(page.description()),
    class: String(page.class()),
    meta: {
      name: String(page.name()),
      isSymbolPage: page.name() === 'Symbols',
    },
    children: getPageLayers(page),
  }))
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

export default function getElementTree() {
  const windows = toArray(NSApp.windows()).filter(win =>
    win.isKindOfClass(MSDocumentWindow)
  )
  return windows.map((win, index) => ({
    type: 'window',
    index,
    id: '?',
    desc: String(win.description()),
    class: String(win.class()),
    meta: {
      name: String(win.title()),
    },
    children: getWindowDocument(win),
  }))
}
