import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import _ from 'lodash';
import { Map } from 'immutable';
import authentication from 'reducers/AuthenticationReducer';
import entry from 'reducers/EntryReducer';
import entryTag from 'reducers/EntryTagReducer';
import entryType from 'reducers/EntryTypeReducer';
import media from 'reducers/MediaReducer';
import mediaTag from 'reducers/MediaTagReducer';
import project from 'reducers/ProjectReducer';
import invite from 'reducers/InviteReducer';
import user from 'reducers/UserReducer';
import webHook from 'reducers/WebHookReducer';
import notification from 'reducers/NotificationReducer';


const promiseMiddleware = store => next => action => {
  if (_.isFunction(_.get(action.payload, 'then'))) {
    action.payload.then(
      result => {
        store.dispatch(
          _.assign({}, action, { type: action.type + '_COMPLETED', payload: result })
        );
        return result;
      },
      error => {
        store.dispatch(
          _.assign({}, action, { type: action.type + '_FAILED', payload: Map(error.response.data) })
        );
        return error;
      }
    );
  }
  return next(action);
};


const initialState = Map();


const rootReducer = combineReducers({
  authentication,
  entry,
  entryTag,
  entryType,
  media,
  mediaTag,
  project,
  invite,
  user,
  webHook,
  notification
});


export default createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(promiseMiddleware, thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);
