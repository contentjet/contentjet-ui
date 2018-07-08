import { createAction } from 'redux-actions';
import axios from 'axios';


export const GET_ENTRY_TAG_LIST = 'GET_ENTRY_TAG_LIST';

const list = createAction(GET_ENTRY_TAG_LIST, projectId => {
  return axios.get(`project/${projectId}/entry-tag/`);
});

export default {
  list
};
