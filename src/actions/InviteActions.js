import { createAction } from 'redux-actions';
import jwt from 'jsonwebtoken';
import axios from 'axios';


export const SAVE_INVITE = 'SAVE_INVITE';
export const GET_INVITE = 'GET_INVITE';
export const GET_INVITE_LIST = 'GET_INVITE_LIST';
export const ACCEPT_INVITE = 'ACCEPT_INVITE';
export const SET_INVITE_TOKEN = 'SET_INVITE_TOKEN';
export const BULK_DESTROY_INVITE = 'BULK_DESTROY_INVITE';


const _save = createAction(SAVE_INVITE, (projectId, data) => {
  return axios.post(`project/${projectId}/invite/`, data);
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


const list = createAction(GET_INVITE_LIST, (projectId) => {
  return axios.get(`project/${projectId}/invite/`);
});


const get = createAction(GET_INVITE, (projectId, inviteId) => {
  return axios.get(`project/${projectId}/invite/${inviteId}/`);
});


const setInviteToken = createAction(SET_INVITE_TOKEN);


const accept = createAction(ACCEPT_INVITE, (token) => {
  const decodedToken = jwt.decode(token);
  const {projectId} = decodedToken;
  return axios.put(`project/${projectId}/invite/accept/`, { token });
});


const _bulkDestroy = createAction(
  BULK_DESTROY_INVITE,
  (projectId, inviteIds) => {
    return axios.post(
      `project/${projectId}/invite/bulk-delete/`, inviteIds
    );
  },
  (projectId, inviteIds) => inviteIds
);


const bulkDestroy = (projectId, inviteIds) => {
  return (dispatch) => {
    const action = _bulkDestroy(projectId, inviteIds);
    dispatch(action);
    action.payload.then(response => {
      dispatch(list(projectId));
      return response;
    });
  };
};


export default {
  save,
  list,
  get,
  setInviteToken,
  accept,
  bulkDestroy
};
