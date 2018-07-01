import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';
import NotificationActions from 'actions/NotificationActions';
import axios from 'axios';


export const SAVE_PROJECT = 'SAVE_PROJECT';
export const GET_PROJECT_LIST = 'GET_PROJECT_LIST';
export const GET_PROJECT = 'GET_PROJECT';
export const DESTROY_PROJECT = 'DESTROY_PROJECT';
export const UPDATE_MEMBER = 'UPDATE_MEMBER';


const _save = createAction(SAVE_PROJECT, (data) => {
  if (data.id) {
    return axios.put(`project/${data.id}/`, data);
  }
  return axios.post('project/', data);
});


const save = (data, redirectOnSuccess) => {
  return (dispatch) => {
    const action = _save(data);
    dispatch(action);
    action.payload.then(
      response => {
        if (redirectOnSuccess) {
          const projectId = response.data.id;
          browserHistory.push(`/project/${projectId}/entry-types`);
        } else {
          dispatch(NotificationActions.show('Project saved'));
        }

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


const list = createAction(GET_PROJECT_LIST, () => {
  return axios.get('project/');
});


const get = createAction(GET_PROJECT, id => {
  return axios.get(`project/${id}/`);
});


const destroy = createAction(DESTROY_PROJECT, (id) => {
  return axios.delete(`project/${id}/`).then(response => {
    browserHistory.replace('/projects/');
    return response;
  });
});

const updateMember = createAction(UPDATE_MEMBER, (projectId, data) => {
  return axios.post(`project/${projectId}/update-member`, data);
});


export default {
  save,
  list,
  get,
  destroy,
  updateMember
};
