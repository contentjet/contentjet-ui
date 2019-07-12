import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { detailStructure, paginatedListStructure } from './lib/utilities';
import {
  SIGN_UP,
  VERIFY_USER,
  REQUEST_RESET_PASSWORD,
  SET_PASSWORD,
  CHANGE_PASSWORD,
  GET_ME,
  SAVE_ME
} from 'actions/UserActions';

const initialVerification = detailStructure.set('data', Map({ verified: false }));

const initialState = Map({
  signUp: detailStructure,
  verification: initialVerification,
  requestPasswordReset: detailStructure,
  setPassword: detailStructure,
  changePassword: detailStructure,
  me: detailStructure
});

export default handleActions(
  {
    [SIGN_UP]: state => {
      return state.set('signUp', detailStructure.set('isSending', true));
    },

    [`${SIGN_UP}_COMPLETED`]: state => {
      return state.set('signUp', detailStructure);
    },

    [`${SIGN_UP}_FAILED`]: (state, action) => {
      return state.set('signUp', detailStructure.set('error', action.payload));
    },

    [VERIFY_USER]: state => {
      return state.set('verification', initialVerification.set('isSending', true));
    },

    [`${VERIFY_USER}_COMPLETED`]: state => {
      return state.setIn(['verification', 'data', 'verified'], true);
    },

    [`${VERIFY_USER}_FAILED`]: (state, action) => {
      return state.set('verification', initialVerification.set('error', action.payload));
    },

    [REQUEST_RESET_PASSWORD]: state => {
      return state.set('requestPasswordReset', detailStructure.set('isSending', true));
    },

    [`${REQUEST_RESET_PASSWORD}_COMPLETED`]: state => {
      return state.set('requestPasswordReset', detailStructure);
    },

    [`${REQUEST_RESET_PASSWORD}_FAILED`]: (state, action) => {
      return state.set('requestPasswordReset', detailStructure.set('error', action.payload));
    },

    [SET_PASSWORD]: state => {
      return state.set('setPassword', detailStructure.set('isSending', true));
    },

    [`${SET_PASSWORD}_COMPLETED`]: state => {
      return state.set('setPassword', detailStructure);
    },

    [`${SET_PASSWORD}_FAILED`]: (state, action) => {
      return state.set('setPassword', detailStructure.set('error', action.payload));
    },

    [CHANGE_PASSWORD]: state => {
      return state.set('changePassword', detailStructure.set('isSending', true));
    },

    [`${CHANGE_PASSWORD}_COMPLETED`]: state => {
      return state.set('changePassword', detailStructure);
    },

    [`${CHANGE_PASSWORD}_FAILED`]: (state, action) => {
      return state.set('changePassword', detailStructure.set('error', action.payload));
    },

    [GET_ME]: state => {
      return state.setIn(['me', 'isFetching'], true);
    },

    [`${GET_ME}_COMPLETED`]: (state, action) => {
      return state
        .setIn(['me', 'data'], action.payload._immutableData)
        .setIn(['me', 'isFetching'], false);
    },

    [`${GET_ME}_FAILED`]: (state, action) => {
      return state.set('me', detailStructure.set('error', action.payload));
    },

    [SAVE_ME]: state => {
      return state.setIn(['me', 'isSending'], true);
    },

    [`${SAVE_ME}_COMPLETED`]: (state, action) => {
      return state
        .setIn(['me', 'data'], action.payload._immutableData)
        .setIn(['me', 'isSending'], false);
    },

    [`${SAVE_ME}_FAILED`]: (state, action) => {
      return state.set('me', paginatedListStructure.set('error', action.payload));
    }
  },
  initialState
);
