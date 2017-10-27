import { SET_TREE } from '../../../../shared-actions'

const FETCH_TREE = 'elements/FETCH_TREE'

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

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
