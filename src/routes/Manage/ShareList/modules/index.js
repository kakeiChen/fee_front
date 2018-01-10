/* eslint-disable arrow-body-style */
import { Toast } from 'antd-mobile';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';


// ------------------------------------
// Constants
// ------------------------------------
const SHARELIST_REQUEST = 'SHARELIST_REQUEST';
const SHARELIST_SUCCESS = 'SHARELIST_SUCCESS';
const SHARELIST_FAILURE = 'SHARELIST_FAILURE';
const SHARELIST_RESET = 'SHARELIST_RESET';

const initialState = {
  data:[],
};
const flagMap = {
  0:'未分享',
  1:'已分享',
};

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  search: () => ({
    types: [SHARELIST_REQUEST, SHARELIST_SUCCESS, SHARELIST_FAILURE],
    callAPI: () => fetch('/projectlist'),
  }),
  reset:createAction(SHARELIST_RESET),
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SHARELIST_REQUEST]:(state) => ({
    ...state,
  }),
  [SHARELIST_SUCCESS]:(state, action) => {
    const newState = Object.assign({}, state);
    const { data } = action;
    const { list } = data;
    newState.data = [];
    for (let i = 0; i < list.length; i += 1) {
      const flag = flagMap[list[i].flag];
      newState.data.push({
        id: list[i].id,
        shareTime:list[i].shareTime,
        description: list[i].description,
        title: list[i].title,
        sharer: list[i].sharer,
        flag,
      });
    }
    return {
      ...newState,
    };
  },
  [SHARELIST_FAILURE]:(state, action) => {
    Toast.fail(action.msg, 1);
    return {
      ...state,
    };
  },
  [SHARELIST_RESET]:() => ({
    ...initialState,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
