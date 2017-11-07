import { handleActions } from 'redux-actions';
import _ from 'lodash';
import Immutable, { Map, List } from 'immutable';
import {
  GET_MEDIA_LIST, GET_MEDIA, SAVE_MEDIA, DESTROY_MEDIA,
  UPLOAD, UPLOAD_PROGRESS, UPLOAD_COMPLETED, UPLOAD_FAILED,
  TOGGLE_SELECT, SELECT_ALL, SELECT_NONE, BULK_DESTROY_MEDIA,
  CLEAR_COMPLETED_UPLOADS
} from 'actions/MediaActions';
import { paginatedListStructure, detailStructure } from './lib/utilities';


const initialMediaList = paginatedListStructure.set('queryParams', null);


const initialState = Map({
  mediaList: initialMediaList,
  mediaDetail: detailStructure,
  selectedMedia: List(),
  uploads: List()
});


export default handleActions({

  [GET_MEDIA_LIST]: (state, action) => {
    return state.mergeIn(['mediaList'], {
      isFetching: true,
      queryParams: action.meta.queryParams,
      error: Map()
    });
  },

  [`${GET_MEDIA_LIST}_COMPLETED`]: (state, action) => {
    return state.merge({
      mediaList: state.get('mediaList').merge({
        data: action.payload._immutableData,
        isFetching: false
      }),
      selectedMedia: List()
    });
  },

  [`${GET_MEDIA_LIST}_FAILED`]: (state, action) => {
    return state
      .set('mediaList', initialMediaList.set('error', action.payload))
      .set('selectedMedia', List());
  },

  [GET_MEDIA]: (state) => {
    return state.set('mediaDetail', detailStructure.set('isFetching', true));
  },

  [`${GET_MEDIA}_COMPLETED`]: (state, action) => {
    return state.set('mediaDetail', detailStructure.set('data', action.payload._immutableData));
  },

  [`${GET_MEDIA}_FAILED`]: (state, action) => {
    return state.set('mediaDetail', detailStructure.set('error', action.payload));
  },

  [SAVE_MEDIA]: (state, action) => {
    return state.set(
      'mediaDetail',
      detailStructure.merge({ isSending: true, data: Map(action.meta) })
    );
  },

  [`${SAVE_MEDIA}_COMPLETED`]: (state, action) => {
    return state.set('mediaDetail', detailStructure.set('data', action.payload._immutableData));
  },

  [`${SAVE_MEDIA}_FAILED`]: (state, action) => {
    return state.set('mediaDetail', detailStructure.set('error', action.payload));
  },

  [DESTROY_MEDIA]: (state, action) => {
    // Optimistically delete
    let mediaAsset = action.meta;
    let results = state.getIn(['mediaList', 'data', 'results']).filter(item => {
      return mediaAsset.id !== item.get('id');
    });
    let count = results.count();
    let newState = state.mergeIn(['mediaList', 'data'], { count, results });
    if (mediaAsset.id === state.getIn(['mediaDetail', 'data']).id) {
      newState.set('mediaDetail', detailStructure);
    }
    return newState;
  },

  [BULK_DESTROY_MEDIA]: (state, action) => {
    // Optimistically delete
    let ids = action.meta;
    let results = state.getIn(['mediaList', 'data', 'results']).filter(item => {
      return !_.includes(ids, item.get('id'));
    });
    let count = results.count();
    return state.mergeIn(['mediaList', 'data'], { count, results});
  },

  [UPLOAD]: (state, action) => {
    let uploads = state.get('uploads').concat(Immutable.fromJS(action.payload));
    return state.set('uploads', uploads);
  },

  [UPLOAD_PROGRESS]: (state, action) => {
    let uploadState = Immutable.fromJS(action.payload);
    let uploads = state.get('uploads');
    let index = uploads.findIndex(
      _uploadState => _uploadState.get('uploadId') === uploadState.get('uploadId')
    );
    uploads = uploads.set(index, uploadState);
    return state.set('uploads', uploads);
  },

  [UPLOAD_COMPLETED]: (state, action) => {
    let uploadState = Immutable.fromJS(action.payload);
    let uploads = state.get('uploads');
    let index = uploads.findIndex(
      _uploadState => _uploadState.get('uploadId') === uploadState.get('uploadId')
    );
    uploads = uploads.set(index, uploadState);
    return state.set('uploads', uploads);
  },

  [UPLOAD_FAILED]: (state, action) => {
    let uploadState = Immutable.fromJS(action.payload);
    let uploads = state.get('uploads');
    let index = uploads.findIndex(
      _uploadState => _uploadState.get('uploadId') === uploadState.get('uploadId')
    );
    uploads = uploads.set(index, uploadState);
    return state.set('uploads', uploads);
  },

  [CLEAR_COMPLETED_UPLOADS]: (state) => {
    let uploads = state.get('uploads').filter((upload) => {
      return upload.get('status') === 'UPLOADING';
    });
    return state.set('uploads', uploads);
  },

  [TOGGLE_SELECT]: (state, action) => {
    let media = Immutable.fromJS(action.payload);
    let selectedMedia = state.get('selectedMedia');
    let index = selectedMedia.findIndex(
      _media => _media.get('id') === media.get('id')
    );
    if (index === -1) {
      state = state.set('selectedMedia', selectedMedia.push(media));
    } else {
      state = state.set('selectedMedia', selectedMedia.delete(index));
    }
    return state;
  },

  [SELECT_ALL]: (state) => {
    return state.set('selectedMedia', state.getIn(['mediaList', 'data', 'results']));
  },

  [SELECT_NONE]: (state) => {
    return state.set('selectedMedia', List());
  }

}, initialState);
