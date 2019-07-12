import { combineReducers } from 'redux-immutable';
import { createListReducer } from './lib/utilities';

export default combineReducers({
  list: createListReducer('MEDIA_TAG')
});
