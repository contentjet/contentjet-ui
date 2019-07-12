import { handleActions } from 'redux-actions';
import { Map } from 'immutable';
import { detailStructure } from './lib/utilities';
import {
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN,
  INIT_AUTHENTICATION,
  SET_REDIRECT_PATH
} from 'actions/AuthenticationActions';

const initialState = detailStructure.set(
  'data',
  Map({ isAuthenticated: false, redirectPath: '/' })
);

export default handleActions(
  {
    [INIT_AUTHENTICATION]: (state, action) => {
      // Note the payload is simply the result of TokenStorage.hasValidToken()
      return state.setIn(['data', 'isAuthenticated'], action.payload);
    },

    [SET_REDIRECT_PATH]: (state, action) => {
      return state.setIn(['data', 'redirectPath'], action.payload);
    },

    [LOGIN]: state => {
      return state.set('isSending', true);
    },

    [`${LOGIN}_COMPLETED`]: (state, action) => {
      // Note the payload is simply the result of TokenStorage.hasValidToken()
      return state.setIn(['data', 'isAuthenticated'], action.payload).set('isSending', false);
    },

    [`${LOGIN}_FAILED`]: (state, action) => {
      return state
        .setIn(['data', 'isAuthenticated'], false)
        .set('isSending', false)
        .set('error', action.payload);
    },

    [REFRESH_TOKEN]: state => {
      return state;
    },

    [`${REFRESH_TOKEN}_COMPLETED`]: (state, action) => {
      // Note the payload is simply the result of TokenStorage.hasValidToken()
      return state.setIn(['data', 'isAuthenticated'], action.payload);
    },

    [`${REFRESH_TOKEN}_FAILED`]: state => {
      // TODO: Maybe 'flash', a message here, prompting the user to re-login.
      // console.log('onRefreshTokenFailed', response);
      return state;
    },

    [LOGOUT]: () => {
      return initialState;
    }
  },
  initialState
);
