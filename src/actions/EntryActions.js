import { createAction } from 'redux-actions';
import axios from 'axios';
// FIXME
// import { browserHistory } from 'react-router';
import NotificationActions from 'actions/NotificationActions';


export const SAVE_ENTRY = 'SAVE_ENTRY';
export const GET_ENTRY_LIST = 'GET_ENTRY_LIST';
export const GET_ENTRY = 'GET_ENTRY';
export const DESTROY_ENTRY = 'DESTROY_ENTRY';
export const BULK_DESTROY_ENTRIES = 'BULK_DESTROY_ENTRIES';
export const CLEAR_ACTIVE_ENTRY = 'CLEAR_ACTIVE_ENTRY';
export const CLEAR_ENTRIES = 'CLEAR_ENTRIES';
export const TOGGLE_SELECT_ENTRY = 'TOGGLE_SELECT_ENTRY';
export const SELECT_ALL_ENTRIES = 'SELECT_ALL_ENTRIES';
export const SELECT_NONE_ENTRIES = 'SELECT_NONE_ENTRIES';


const _save = createAction(
  SAVE_ENTRY,
  (projectId, data) => {
    if (data.id) {
      return axios.put(`project/${projectId}/entry/${data.id}/`, data);
    }
    return axios.post(`project/${projectId}/entry/`, data);
  },
  (projectId, data) => {
    return data;
  }
);


const save = (projectId, data) => {
  return (dispatch) => {
    const saveAction = _save(projectId, data);
    dispatch(saveAction);

    saveAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Entry saved'));
        // browserHistory.replace(
        //   `/project/${projectId}/entries/${response.data.entryTypeId}/${response.data.id}`
        // );
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


const list = createAction(
  GET_ENTRY_LIST,
  (projectId, params) => {
    return axios.get(`project/${projectId}/entry/`, { params });
  },
  (projectId, params) => ({ queryParams: params })
);


const relist = (projectId) => {
  return (dispatch, getState) => {
    const queryParams = getState().getIn(['entry', 'entryList', 'queryParams']);
    dispatch(list(projectId, queryParams));
  };
};


const get = createAction(GET_ENTRY, (projectId, entryId) => {
  return axios.get(`project/${projectId}/entry/${entryId}/`);
});


const destroy = createAction(DESTROY_ENTRY,
  (projectId, entry) => {
    return axios.delete(`project/${projectId}/entry/${entry.id}/`).then(response => {
      browserHistory.replace(`/project/${projectId}/entries`);
      return response;
    });
  },
  (projectId, entry) => entry
);


const _bulkDestroy = createAction(
  BULK_DESTROY_ENTRIES,
  (projectId, entryIds) => {
    return axios.post(
      `project/${projectId}/entry/bulk-delete/`, entryIds
    );
  },
  (projectId, entryIds) => entryIds
);


const bulkDestroy = (projectId, entryIds) => {
  return (dispatch) => {
    const action = _bulkDestroy(projectId, entryIds);
    dispatch(action);
    action.payload.then(response => {
      dispatch(relist(projectId));
      return response;
    });
  };
};


const clearActiveEntry = createAction(CLEAR_ACTIVE_ENTRY);


const clearEntries = createAction(CLEAR_ENTRIES);


const toggleSelect = createAction(TOGGLE_SELECT_ENTRY);


const selectAll = createAction(SELECT_ALL_ENTRIES);


const selectNone = createAction(SELECT_NONE_ENTRIES);


export default {
  save,
  list,
  get,
  destroy,
  bulkDestroy,
  clearActiveEntry,
  clearEntries,
  toggleSelect,
  selectAll,
  selectNone
};
