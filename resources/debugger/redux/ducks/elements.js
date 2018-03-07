import {
  SET_TREE,
  SET_PAGE_METADATA,
  SET_LAYER_METADATA,
} from '../../../../shared-actions'

const FETCH_TREE = 'elements/FETCH_TREE'
const FETCH_PAGE_METADATA = 'elements/FETCH_PAGE_METADATA'
const FETCH_LAYER_METADATA = 'elements/FETCH_LAYER_METADATA'

const initialState = {
  loading: true,
  tree: [],
}

const handlers = {}

export const fetchTree = () => ({
  type: FETCH_TREE,
  meta: {
    sketch: ['getSketchState'],
  },
})

handlers[FETCH_TREE] = state => ({
  ...state,
  loading: true,
})

export const setTree = tree => ({
  type: SET_TREE,
  payload: {
    tree,
  },
})

handlers[SET_TREE] = (state, { payload }) => ({
  ...state,
  tree: payload.tree,
  loading: false,
})

export const fetchPageMetadata = pageId => ({
  type: FETCH_PAGE_METADATA,
  meta: {
    sketch: ['getPageMetadata', pageId],
  },
})

export const fetchLayerMetadata = (layerId, pageId) => ({
  type: FETCH_LAYER_METADATA,
  meta: {
    sketch: ['getLayerMetadata', layerId, pageId],
  },
})

export const setPageMetadata = ({ state, pageId }) => ({
  type: SET_PAGE_METADATA,
  payload: {
    state,
    pageId,
  },
})

handlers[SET_PAGE_METADATA] = (state, { payload }) => ({
  ...state,
  tree: state.tree.map(d => ({
    ...d,
    children: d.children.map(c => ({
      ...c,
      children: c.children.map(page => {
        if (page.id === payload.pageId) {
          if (page.children) {
            return {
              ...page,
              meta: payload.state.meta,
              children: payload.state.map(x => {
                const existingChild = page.children.find(y => y.id === x.id)
                if (existingChild) {
                  return {
                    ...existingChild,
                    ...c,
                  }
                }
                return c
              }),
            }
          }
          return {
            ...page,
            ...payload.state,
          }
        }
        return page
      }),
    })),
  })),
})

export const setLayerMetadata = ({ state, pageId, layerId }) => ({
  type: SET_LAYER_METADATA,
  payload: {
    state,
    pageId,
    layerId,
  },
})

function findLayerWithId(layerId, fn, layer) {
  if (layer.id === layerId) {
    return fn(layer)
  }
  if (!layer.children) {
    return layer
  }
  return {
    ...layer,
    children: layer.children.map(findLayerWithId.bind(this, layerId, fn)),
  }
}

handlers[SET_LAYER_METADATA] = (state, { payload }) => ({
  ...state,
  tree: state.tree.map(d => ({
    ...d,
    children: d.children.map(c => ({
      ...c,
      children: c.children.map(page => {
        if (page.id === payload.pageId) {
          return {
            ...page,
            children: page.children.map(
              findLayerWithId.bind(this, payload.layerId, layer => {
                if (layer.children) {
                  return {
                    ...layer,
                    meta: payload.state.meta,
                    children: payload.state.map(child => {
                      const existingChild = layer.children.find(
                        x => child.id === x.id
                      )
                      if (existingChild) {
                        return {
                          ...existingChild,
                          ...child,
                        }
                      }
                      return child
                    }),
                  }
                }
                return {
                  ...layer,
                  ...payload.state,
                }
              })
            ),
          }
        }
        return page
      }),
    })),
  })),
})

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
