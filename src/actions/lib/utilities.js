import { createAction } from 'redux-actions';
import axios from 'axios';

export const createEndpointActions = (endpoint, TYPE) => {

  const list = createAction(`GET_${TYPE}_LIST`, (params) => {
    return axios.get(endpoint, { params });
  });


  const get = createAction(`GET_${TYPE}`, (id, params) => {
    return axios.get(`${endpoint}${id}/`, { params });
  });


  const destroy = createAction(`DESTROY_${TYPE}`,
    (id) => {
      return axios.delete(`${endpoint}${id}/`);
    },
    (id) => id
  );


  const save = createAction(`SAVE_${TYPE}`, (data) => {
    if (data.id) {
      return axios.put(`${endpoint}${data.id}/`, data);
    }
    return axios.post(endpoint, data);
  });


  const clear = createAction(`CLEAR_${TYPE}`);


  const getMeta = createAction(`GET_${TYPE}_META`, (id) => {
    // Axios doesn't have an options alias :\
    return axios({
      method: 'options',
      url: id ? `${endpoint}${id}/` : endpoint
    });
  });


  return {
    list,
    get,
    destroy,
    save,
    clear,
    getMeta
  };

};
