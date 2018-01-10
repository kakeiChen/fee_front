/* eslint-disable arrow-body-style */
import { Toast } from 'antd-mobile';
import fetch from '../../../../util/fetch';
import { createAction } from '../../../../util';
// ------------------------------------
// Constants
// ------------------------------------
const EVALUATESUBMIT_REQUEST = 'EVALUATESUBMIT_REQUEST';
const EVALUATESUBMIT_SUCCESS = 'EVALUATESUBMIT_SUCCESS';
const EVALUATESUBMIT_FAILURE = 'EVALUATESUBMIT_FAILURE';
const EVALUATESUBMIT_RECORD_CHANGE = 'EVALUATESUBMIT_RECORD_CHANGE';
const EVALUATESUBMIT_SCORE_ADD = 'EVALUATESUBMIT_SCORE_ADD';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  submit: (params) => ({
    types: [EVALUATESUBMIT_REQUEST, EVALUATESUBMIT_SUCCESS, EVALUATESUBMIT_FAILURE],
    callAPI: () => fetch('/submitDetail', params),
  }),
  changeRecord: createAction(EVALUATESUBMIT_RECORD_CHANGE, 'fields'),
  addScore:createAction(EVALUATESUBMIT_SCORE_ADD),
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [EVALUATESUBMIT_REQUEST]:(state) => ({
    ...state,
  }),
  [EVALUATESUBMIT_SUCCESS]:(state, action) => {
    Toast.success(action.msg, 1);
    return {
      ...state,
    };
  },
  [EVALUATESUBMIT_FAILURE]:(state, action) => {
    Toast.fail(action.msg, 1);
    return {
      ...state,
    };
  },
  [EVALUATESUBMIT_RECORD_CHANGE]:(state, action) => ({
    ...state,
    record: {
      ...state.record,
      ...action.fields,
    },
  }),
  [EVALUATESUBMIT_SCORE_ADD]:(state) => {
    let score = 6;
    (state.record.meritScoreF !== '') && (score += parseInt(state.record.meritScoreF, 10));
    (state.record.meritScoreS !== '') && (score += parseInt(state.record.meritScoreS, 10));
    (state.record.meritScoreT !== '') && (score += parseInt(state.record.meritScoreT, 10));
    (state.record.defectScoreF !== '') && (score -= parseInt(state.record.defectScoreF, 10));
    (state.record.defectScoreS !== '') && (score -= parseInt(state.record.defectScoreS, 10));
    (state.record.defectScoreT !== '') && (score -= parseInt(state.record.defectScoreT, 10));
    return {
      ...state,
      record: {
        ...state.record,
        score,
      },
    };
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  record:{
    meritF:'',
    meritS:'',
    meritT:'',
    meritScoreF:'',
    meritScoreS:'',
    meritScoreT:'',
    defectF:'',
    defectS:'',
    defectT:'',
    defectScoreF:'',
    defectScoreS:'',
    defectScoreT:'',
    suggestF:'',
    suggestS:'',
    suggestT:'',
    score:6,
  },
};

export default function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
