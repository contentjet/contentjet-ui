import { combineReducers } from 'redux-immutable';
import { createPaginatedListReducer, createDetailReducer } from './lib/utilities';


export default combineReducers({
  list: createPaginatedListReducer('WEB_HOOK'),
  detail: createDetailReducer('WEB_HOOK')
});
