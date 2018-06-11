import { combineReducers } from 'redux-immutable';
import { createListReducer, createDetailReducer } from './lib/utilities';


export default combineReducers({
  list: createListReducer('CLIENT'),
  detail: createDetailReducer('CLIENT')
});
