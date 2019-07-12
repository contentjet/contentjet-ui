import { createAction } from 'redux-actions';
import _ from 'lodash';

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

const hide = createAction(HIDE_NOTIFICATION);

const clear = createAction(CLEAR_NOTIFICATION);

const _show = createAction(SHOW_NOTIFICATION, (message, status = 'success') => {
  return { message, status };
});

const show = (message, status) => {
  return dispatch => {
    dispatch(_show(message, status));
    _.delay(dispatch, 3500, hide());
  };
};

export default {
  show,
  hide,
  clear
};
