import { Map } from 'immutable';
import { handleActions } from 'redux-actions';


export const struct = Map({
  show: false,
  message: '',
  status: 'success'
});


export default handleActions({

  ['SHOW_NOTIFICATION']: (state, action) => {
    return state.merge({ show: true }, action.payload);
  },

  ['HIDE_NOTIFICATION']: (state) => {
    return state.set('show', false);
  },

  ['CLEAR_NOTIFICATION']: () => {
    return struct;
  }

}, struct);
