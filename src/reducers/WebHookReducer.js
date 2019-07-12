import { combineReducers } from 'redux-immutable';
import { createListReducer, createDetailReducer } from './lib/utilities';

export default combineReducers({
  list: createListReducer('WEB_HOOK'),
  detail: createDetailReducer('WEB_HOOK')
});
