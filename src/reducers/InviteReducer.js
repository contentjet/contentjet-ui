import _ from 'lodash';
import { combineReducers } from 'redux-immutable';
import { createListReducer, createDetailReducer, detailStructure } from './lib/utilities';

const initialDetailStructure = detailStructure.set('inviteToken', null);

const extraListReducers = {
  BULK_DESTROY_INVITE: (state, action) => {
    // Optimistically delete
    const ids = action.meta;
    const results = state.get('data').filter(item => {
      return !_.includes(ids, item.get('id'));
    });
    return state.set('data', results);
  }
};

const extraDetailReducers = {
  SET_INVITE_TOKEN: (state, action) => {
    return state.set('inviteToken', action.payload);
  },

  ACCEPT_INVITE: state => {
    return state.set('isSending', true);
  },

  ACCEPT_INVITE_COMPLETED: (state, action) => {
    return initialDetailStructure
      .set('isSending', false)
      .set('data', action.payload._immutableData);
  },

  ACCEPT_INVITE_FAILED: (state, action) => {
    return state.set('isSending', false).set('error', action.payload);
  },

  SIGN_UP_COMPLETED: state => {
    return state.set('inviteToken', null);
  }
};

export default combineReducers({
  list: createListReducer('INVITE', extraListReducers),
  detail: createDetailReducer('INVITE', extraDetailReducers, initialDetailStructure)
});
