import { createAction } from 'redux-actions';
import axios from 'axios';
import TokenStorage from 'services/TokenStorage';


export const INIT_AUTHENTICATION = 'INIT_AUTHENTICATION';
export const SET_REDIRECT_PATH = 'SET_REDIRECT_PATH';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';

const initAuthentication = createAction(INIT_AUTHENTICATION, () => {
  return TokenStorage.hasValidToken();
});

const setRedirectPath = createAction(SET_REDIRECT_PATH);

const login = createAction(LOGIN, credentials => {
  credentials.grant_type = 'password';
  return axios.post('authenticate/', credentials).then(
    response => {
      TokenStorage.setToken(response.data.access_token);
      return TokenStorage.hasValidToken();
    },
    error => {
      TokenStorage.deleteToken();
      // Note we are not handling the error here so we must re-throw it so
      // any downstream handlers correctly get the error.
      throw error;
    }
  );
});

const refreshToken = createAction(REFRESH_TOKEN, () => {
  const data = {
    refresh_token: TokenStorage.getToken(),
    grant_type: 'refresh_token'
  };
  return axios.post('token-refresh/', data).then(
    response => {
      TokenStorage.setToken(response.data.access_token);
      return TokenStorage.hasValidToken();
    }
  );
});

const _logout = createAction(LOGOUT);

const logout = () => {
  return (dispatch) => {
    TokenStorage.deleteToken();
    dispatch(_logout());
  };
};

export default {
  initAuthentication,
  setRedirectPath,
  login,
  refreshToken,
  logout
};
