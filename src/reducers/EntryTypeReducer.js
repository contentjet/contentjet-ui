import { combineReducers } from 'redux-immutable';
import { List } from 'immutable';
import { createPaginatedListReducer, createDetailReducer, detailStructure } from './lib/utilities';


const detailStruct = detailStructure.setIn(['data', 'fields'], List());


export default combineReducers({
  list: createPaginatedListReducer('ENTRY_TYPE'),
  detail: createDetailReducer('ENTRY_TYPE', undefined, detailStruct)
});
