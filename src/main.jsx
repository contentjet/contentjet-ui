'use strict';
import 'normalize.css';
import 'react-widgets/dist/css/react-widgets.css';
import './styles/main.css';
import './robots.txt';
import axios from 'axios';
import TokenStorage from 'services/TokenStorage';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './views/App';
import store from 'store';
import AuthenticationActions from 'actions/AuthenticationActions';
import Immutable from 'immutable';


// Set axios defaults
axios.defaults.baseURL = window.contentjet.BACKEND_URL;
axios.interceptors.request.use(
  config => {
    const accessToken = TokenStorage.getToken();
    if (accessToken) {
      config.headers = Object.assign({}, config.headers, { 'Authorization': `Bearer ${accessToken}` });
    }
    return config;
  }
);
axios.interceptors.response.use(
  (response) => {
    // We decorate the axios response with an immutable version of the data so
    // we don't have to call Immutable.fromJS(action.payload.data) in
    // our reducers.
    response._immutableData = Immutable.fromJS(response.data);
    return response;
  }
);

// Initialise authentication
store.dispatch(AuthenticationActions.initAuthentication());

function queryTokenStatus () {
  // Check if the current token is about to expire. If it is refresh it.
  if (TokenStorage.tokenExpiringSoon()) {
    store.dispatch(AuthenticationActions.refreshToken());
  }
}
// Every 2 minutes check if we need to refresh our authentication token.
setInterval(queryTokenStatus, 60000 * 2);
queryTokenStatus();

const router = (
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(router, document.getElementById('content'));
