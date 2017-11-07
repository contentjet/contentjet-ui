import { createAction } from 'redux-actions';
import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';
import { browserHistory } from 'react-router';
import NotificationActions from 'actions/NotificationActions';
import MediaTagActions from 'actions/MediaTagActions';


export const GET_MEDIA_LIST = 'GET_MEDIA_LIST';
export const GET_MEDIA = 'GET_MEDIA';
export const SAVE_MEDIA = 'SAVE_MEDIA';
export const DESTROY_MEDIA = 'DESTROY_MEDIA';
export const BULK_DESTROY_MEDIA = 'BULK_DESTROY_MEDIA';
export const UPLOAD = 'UPLOAD';
export const UPLOAD_COMPLETED = 'UPLOAD_COMPLETED';
export const UPLOAD_FAILED = 'UPLOAD_FAILED';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const TOGGLE_SELECT = 'TOGGLE_SELECT';
export const SELECT_ALL = 'SELECT_ALL';
export const SELECT_NONE = 'SELECT_NONE';
export const CLEAR_COMPLETED_UPLOADS = 'CLEAR_COMPLETED_UPLOADS';


const list = createAction(
  GET_MEDIA_LIST,
  (projectId, queryParams) => {
    let query = queryString.stringify(queryParams);
    return axios.get(`project/${projectId}/media/?${query}`);
  },
  (projectId, queryParams) => ({ queryParams })
);


const relist = (projectId) => {
  return (dispatch, getState) => {
    let queryParams = getState().getIn(['media', 'mediaList', 'queryParams']);
    dispatch(list(projectId, queryParams));
  };
};


const get = createAction(GET_MEDIA, (projectId, mediaId) => {
  return axios.get(`project/${projectId}/media/${mediaId}/`);
});


const _save = createAction(
  SAVE_MEDIA,
  (projectId, data) => {
    return axios.put(`project/${projectId}/media/${data.id}/`, data);
  },
  (projectId, data) => data
);


const save = (projectId, data) => {
  return (dispatch) => {
    let saveAction = _save(projectId, data);
    dispatch(saveAction);
    saveAction.payload.then(
      response => {
        dispatch(NotificationActions.show('Media saved'));
        // New tags may have been created so we re-fetch tags.
        dispatch(MediaTagActions.list(projectId));
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


const destroy = createAction(DESTROY_MEDIA,
  (projectId, mediaAsset) => {
    return axios.delete(`project/${projectId}/media/${mediaAsset.id}/`).then(
      response => {
        browserHistory.replace(`/project/${projectId}/media`);
        return response;
      }
    );
  },
  (projectId, mediaAsset) => mediaAsset
);


const _bulkDestroy = createAction(
  BULK_DESTROY_MEDIA,
  (projectId, mediaAssetIds) => {
    return axios.post(
      `project/${projectId}/media/bulk-delete/`, mediaAssetIds
    );
  },
  (projectId, mediaAssetIds) => mediaAssetIds
);


const bulkDestroy = (projectId, mediaAssetIds) => {
  return (dispatch) => {
    let action = _bulkDestroy(projectId, mediaAssetIds);
    dispatch(action);
    action.payload.then(response => {
      dispatch(relist(projectId));
      return response;
    });
  };
};


const toggleSelect = createAction(TOGGLE_SELECT);


const selectAll = createAction(SELECT_ALL);


const selectNone = createAction(SELECT_NONE);


const uploadProgress = createAction(UPLOAD_PROGRESS);


const uploadCompleted = createAction(UPLOAD_COMPLETED);


const uploadFailed = createAction(UPLOAD_FAILED);


const _upload = createAction(UPLOAD);


const upload = (projectId, files) => {
  return (dispatch) => {
    let url = `project/${projectId}/media/upload`;
    let uploads = [];
    let promises = [];

    files.forEach(file => {
      // Create upload state object
      let uploadState = {
        uploadId: _.uniqueId('upload_'),
        progress: 0,
        filename: file.name,
        status: 'UPLOADING'
      };
      // Create formData and attach file to it.
      let data = new FormData();
      data.append('name', file.name);
      data.append('file', file);
      // Post
      let promise = axios.post(
        url,
        data,
        {
          onUploadProgress: (e) => {
            let done = e.position || e.loaded;
            let total = e.totalSize || e.total;
            uploadState.progress = (done / total) * 0.95;
            dispatch(uploadProgress(uploadState));
          }
        }
      ).then(() => {
        uploadState.progress = 1;
        uploadState.status = 'COMPLETED';
        dispatch(uploadCompleted(uploadState));
        dispatch(relist(projectId));
      }).catch(() => {
        uploadState.status = 'ERROR';
        dispatch(uploadFailed(uploadState));
      });
      promises.push(promise);
      uploads.push(uploadState);
    });
    dispatch(_upload(uploads));
    return Promise.all(promises);
  };
};


const clearCompletedUploads = createAction(CLEAR_COMPLETED_UPLOADS);


export default {
  list,
  relist,
  get,
  save,
  destroy,
  bulkDestroy,
  toggleSelect,
  selectAll,
  selectNone,
  upload,
  clearCompletedUploads
};
