import _ from 'lodash';
import { combineReducers } from 'redux-immutable';
import { createPaginatedListReducer, createDetailReducer, detailStructure } from './lib/utilities';

const initialDetailStructure = detailStructure.set('inviteToken', null);

const extraListReducers = {

  'BULK_DESTROY_INVITE': (state, action) => {
    // Optimistically delete
    let ids = action.meta;
    let results = state.getIn(['data', 'results']).filter(item => {
      return !_.includes(ids, item.get('id'));
    });
    let count = results.count();
    return state.mergeIn(['data'], { count, results});
  }

};


const extraDetailReducers = {

  'SET_INVITE_TOKEN': (state, action) => {
    return state.set('inviteToken', action.payload);
  },

  'ACCEPT_INVITE': (state) => {
    return state.set('isSending', true);
  },

  'ACCEPT_INVITE_COMPLETED': (state, action) => {
    return initialDetailStructure
      .set('isSending', false)
      .set('data', action.payload._immutableData);
  },

  'ACCEPT_INVITE_FAILED': (state, action) => {
    return state
      .set('isSending', false)
      .set('error', action.payload);
  },

  'SIGN_UP_COMPLETED': (state) => {
    return state.set('inviteToken', null);
  }

};


export default combineReducers({
  list: createPaginatedListReducer('INVITE', extraListReducers),
  detail: createDetailReducer('INVITE', extraDetailReducers, initialDetailStructure)
});
