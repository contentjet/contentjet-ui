import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import { createPaginatedListReducer, createDetailReducer, detailStructure } from './lib/utilities';

const updateMemberStruct = detailStructure;

export default combineReducers({
  list: createPaginatedListReducer('PROJECT'),
  detail: createDetailReducer('PROJECT'),
  updateMember: handleActions({

    ['UPDATE_MEMBER']: (state) => {
      return state.set('isSending', true);
    },

    ['UPDATE_MEMBER_COMPLETED']: (state, action) => {
      return updateMemberStruct
        .set('isSending', false)
        .set('data', action.payload._immutableData);
    },

    ['UPDATE_MEMBER_FAILED']: (state, action) => {
      return state
        .set('isSending', false)
        .set('error', action.payload);
    }

  }, updateMemberStruct)
});
