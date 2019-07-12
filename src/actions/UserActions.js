import { createAction } from 'redux-actions';
import NotificationActions from 'actions/NotificationActions';
import axios from 'axios';

export const SIGN_UP = 'SIGN_UP';
export const VERIFY_USER = 'VERIFY_USER';
export const REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD';
export const SET_PASSWORD = 'SET_PASSWORD';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const SAVE_ME = 'SAVE_ME';
export const GET_ME = 'GET_ME';

const signUp = createAction(SIGN_UP, data => {
  return axios.post('user/sign-up/', data);
});

const verifyUser = createAction(VERIFY_USER, token => {
  return axios.post('user/verify/', { token });
});

const requestResetPassword = createAction(REQUEST_RESET_PASSWORD, email => {
  return axios.post('user/request-password-reset/', { email });
});

const setPassword = createAction(SET_PASSWORD, (token, password) => {
  return axios.post('user/set-password/', { token, password });
});

const _changePassword = createAction(CHANGE_PASSWORD, ({ password, newPassword }) => {
  return axios.post('user/change-password/', { password, newPassword });
});

const changePassword = ({ password, newPassword }) => {
  return dispatch => {
    const changePasswordAction = _changePassword({ password, newPassword });
    dispatch(changePasswordAction);
    changePasswordAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Password changed'));
        return response;
      },
      response => {
        dispatch(
          NotificationActions.show('Password change failed. See form below for errors.', 'error')
        );
        return response;
      }
    );
  };
};

const getMe = createAction(GET_ME, () => {
  return axios.get('user/me');
});

const _saveMe = createAction(SAVE_ME, data => {
  return axios.put('user/me/', data);
});

const saveMe = data => {
  return dispatch => {
    const saveMeAction = _saveMe(data);
    dispatch(saveMeAction);
    saveMeAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Profile saved'));
        return response;
      },
      response => {
        dispatch(NotificationActions.show('Save failed. See form below for errors.', 'error'));
        return response;
      }
    );
  };
};

export default {
  signUp,
  verifyUser,
  requestResetPassword,
  setPassword,
  changePassword,
  saveMe,
  getMe
};
