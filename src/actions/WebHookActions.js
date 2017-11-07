import { createAction } from 'redux-actions';
import axios from 'axios';


export const GET_WEB_HOOK_LIST = 'GET_WEB_HOOK_LIST';
export const SAVE_WEB_HOOK = 'SAVE_WEB_HOOK';
export const DESTROY_WEB_HOOK = 'DESTROY_WEB_HOOK';


const list = createAction(GET_WEB_HOOK_LIST, projectId => {
  return axios.get(`project/${projectId}/web-hook/`);
});


const _save = createAction(SAVE_WEB_HOOK, (projectId, data) => {
  if (data.id) {
    return axios.put(`project/${projectId}/web-hook/${data.id}/`, data);
  }
  return axios.post(`project/${projectId}/web-hook/`, data);
});


const save = (projectId, data) => {
  return (dispatch) => {
    let action = _save(projectId, data);
    dispatch(action);
    action.payload.then(response => {
      dispatch(list(projectId));
      return response;
    });
  };
};


const _destroy = createAction(
  DESTROY_WEB_HOOK,
  (projectId, webHookId) => {
    return axios.delete(`project/${projectId}/web-hook/${webHookId}/`);
  },
  (projectId, webHookId) => webHookId
);


const destroy = (projectId, webHookId) => {
  return (dispatch) => {
    let action = _destroy(projectId, webHookId);
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
