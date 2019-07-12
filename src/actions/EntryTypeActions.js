import { createAction } from 'redux-actions';
import axios from 'axios';
import NotificationActions from 'actions/NotificationActions';

export const SAVE_ENTRY_TYPE = 'SAVE_ENTRY_TYPE';
export const GET_ENTRY_TYPE_LIST = 'GET_ENTRY_TYPE_LIST';
export const GET_ENTRY_TYPE = 'GET_ENTRY_TYPE';
export const DESTROY_ENTRY_TYPE = 'DESTROY_ENTRY_TYPE';
export const CLEAR_ENTRY_TYPE = 'CLEAR_ENTRY_TYPE';

const _save = createAction(
  SAVE_ENTRY_TYPE,
  (projectId, data) => {
    if (data.id) {
      return axios.put(`project/${projectId}/entry-type/${data.id}/`, data);
    }
    return axios.post(`project/${projectId}/entry-type/`, data);
  },
  (projectId, data) => data
);

const save = (projectId, data, history) => {
  return dispatch => {
    const saveAction = _save(projectId, data);
    dispatch(saveAction);

    saveAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Entry type saved'));
        history.replace(`/project/${projectId}/entry-types/edit/${response.data.id}`);
        return response;
      },
      response => {
        dispatch(NotificationActions.show('Save failed. See below for errors.', 'error'));
        return response;
      }
    );
  };
};

const list = createAction(GET_ENTRY_TYPE_LIST, projectId => {
  return axios.get(`project/${projectId}/entry-type/`);
});

const get = createAction(GET_ENTRY_TYPE, (projectId, entryTypeId) => {
  return axios.get(`project/${projectId}/entry-type/${entryTypeId}/`);
});

const destroy = createAction(DESTROY_ENTRY_TYPE, (projectId, entryTypeId, history) => {
  return axios.delete(`project/${projectId}/entry-type/${entryTypeId}/`).then(response => {
    history.replace(`/project/${projectId}/entry-types/`);
    return response;
  });
});

const clear = createAction(CLEAR_ENTRY_TYPE);

export default {
  save,
  list,
  get,
  destroy,
  clear
};
