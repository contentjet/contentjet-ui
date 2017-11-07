import { createAction } from 'redux-actions';
import NotificationActions from 'actions/NotificationActions';
import axios from 'axios';


export const SIGN_UP = 'SIGN_UP';
export const VERIFY_USER = 'VERIFY_USER';
export const REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const SAVE_ME = 'SAVE_ME';
export const GET_ME = 'GET_ME';


const signUp = createAction(SIGN_UP, (data) => {
  return axios.post('user/sign-up/', data);
});


const verifyUser = createAction(VERIFY_USER, (token) => {
  return axios.post('user/verify/', { token });
});


const requestResetPassword = createAction(REQUEST_RESET_PASSWORD, (email) => {
  return axios.post('user/request-password-reset/', { email });
});


const changePassword = createAction(CHANGE_PASSWORD, (token, password) => {
  return axios.post('user/set-password/', { token, password });
});


const getMe = createAction(GET_ME, () => {
  return axios.get('user/me');
});


const _saveMe = createAction(SAVE_ME, (data) => {
  return axios.put('user/me/', data);
});


const saveMe = (data) => {
  return (dispatch) => {
    let saveMeAction = _saveMe(data);
    dispatch(saveMeAction);
    saveMeAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Profile saved'));
        return response;
      },
      response => {
        dispatch(NotificationActions.show(
          'Save failed. See form below for errors.', 'error'
        ));
        return response;
      }
    );
  };
};


export default {
  signUp,
  verifyUser,
  requestResetPassword,
  changePassword,
  saveMe,
  getMe
};
