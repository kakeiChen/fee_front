/* eslint-disable arrow-body-style */
import { Toast } from 'antd-mobile';
import fetch from '../../../../util/fetch';
// ------------------------------------
// Constants
// ------------------------------------
const SHAREDETAIL_REQUEST = 'SHAREDETAIL_REQUEST';
const SHAREDETAIL_SUCCESS = 'SHAREDETAIL_SUCCESS';
const SHAREDETAIL_FAILURE = 'SHAREDETAIL_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  detail: (params) => ({
    types: [SHAREDETAIL_REQUEST, SHAREDETAIL_SUCCESS, SHAREDETAIL_FAILURE],
    callAPI: () => fetch('/getdetail', params),
  }),
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHAREDETAIL_REQUEST]:(state) => ({
    ...state,
  }),
  [SHAREDETAIL_SUCCESS]:(state, action) => {
    const { data } = action;
    const { list, averageScore } = data;
    return {
      ...state,
      list,
      averageScore,
    };
  },
  [SHAREDETAIL_FAILURE]:(state, action) => {
    Toast.fail(action.msg, 1);
    return {
      ...state,
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  list:[],
  averageScore:0,
};

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
