import { createAction } from 'redux-actions';
import axios from 'axios';


export const GET_MEDIA_TAG_LIST = 'GET_MEDIA_TAG_LIST';


const list = createAction(GET_MEDIA_TAG_LIST, projectId => {
  return axios.get(`project/${projectId}/media-tag/`);
});


export default {
  list
};
