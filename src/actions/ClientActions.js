import { createAction } from 'redux-actions';
import axios from 'axios';


export const SAVE_CLIENT = 'SAVE_CLIENT';
export const GET_CLIENT_LIST = 'GET_CLIENT_LIST';
export const DESTROY_CLIENT = 'DESTROY_CLIENT';

const list = createAction(GET_CLIENT_LIST, projectId => {
  return axios.get(`project/${projectId}/client/`);
});

const _save = createAction(SAVE_CLIENT, (projectId, data) => {
  if (data.id) {
    return axios.put(`project/${projectId}/client/${data.id}/`, data);
  }
  return axios.post(`project/${projectId}/client/`, data);
});

const save = (projectId, data) => {
  return (dispatch) => {
    const action = _save(projectId, data);
    dispatch(action);
    action.payload.then(response => {
      dispatch(list(projectId));
      return response;
    });
  };
};

const _destroy = createAction(
  DESTROY_CLIENT,
  (projectId, clientId) => {
    return axios.delete(`project/${projectId}/client/${clientId}/`);
  },
  (projectId, clientId) => clientId
);

const destroy = (projectId, clientId) => {
  return (dispatch) => {
    const action = _destroy(projectId, clientId);
    dispatch(action);
    action.payload.then(response => {
      dispatch(list(projectId));
      return response;
    });
  };
};

export default {
  list,
  save,
  destroy
};
