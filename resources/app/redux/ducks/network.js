import dayjs from 'dayjs'
import { ADD_REQUEST, SET_RESPONSE } from '../../../../shared-actions'

const initialState = {
  requests: [],
}

const handlers = {}

export const addRequest = (request, uid) => ({
  type: ADD_REQUEST,
  payload: {
    request,
    uid,
  },
})

handlers[ADD_REQUEST] = (state, { payload }) => ({
  ...state,
  requests: state.requests.concat({
    uid: payload.uid,
    request: payload.request,
    started: dayjs(),
    finished: false,
    response: null,
  }),
})

export const setResponse = (response, uid) => ({
  type: SET_RESPONSE,
  payload: {
    response,
    uid,
  },
})

handlers[SET_RESPONSE] = (state, { payload }) => {
  const findRequestIndex = state.requests.findIndex(r => r.uid === payload.uid)
  if (findRequestIndex === -1) {
    console.error(`Cannot find request for response with uid ${payload.uid}!`)
    return state
  }

  const requests = [...state.requests]
  requests[findRequestIndex] = {
    ...requests.findRequestIndex,
    finished: dayjs(),
    response: payload.response,
  }

  return {
    ...state,
    requests,
  }
}

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
