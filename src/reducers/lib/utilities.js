import Immutable from 'immutable';
import { handleActions } from 'redux-actions';


export const listStructure = Immutable.fromJS({
  data: [],
  error: {},
  isFetching: false
});


export const paginatedListStructure = Immutable.fromJS({
  data: {
    page: 1,
    totalRecords: 0,
    totalPages: 1,
    results: []
  },
  error: {},
  isFetching: false
});


export const detailStructure = Immutable.fromJS({
  data: {},
  error: {},
  isFetching: false,
  isSending: false
});


export const metaStructure = Immutable.fromJS({
  data: {},
  error: {},
  isFetching: false
});


export const uploadStructure= Immutable.fromJS({
  uploads: []
});


export const createListReducer = (TYPE, extraReducers, struct = listStructure) => {
  let reducerMap = {

    [`GET_${TYPE}_LIST`]: (state) => {
      return state.set('isFetching', true);
    },

    [`GET_${TYPE}_LIST_COMPLETED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('data', action.payload._immutableData);
    },

    [`GET_${TYPE}_LIST_FAILED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('error', action.payload);
    },

    [`DESTROY_${TYPE}`]: (state, action) => {
      const id = action.meta;
      return state.update('data', data => {
        return data.filter(item => item.get('id') !== id);
      });
    },

    [`CLEAR_${TYPE}_LIST`]: () => {
      return struct;
    }

  };
  if (extraReducers) {
    reducerMap = Object.assign(reducerMap, extraReducers);
  }
  return handleActions(reducerMap, struct);
};


export const createPaginatedListReducer = (TYPE, extraReducers, struct = paginatedListStructure) => {
  let reducerMap = {

    [`GET_${TYPE}_LIST`]: (state) => {
      return state.set('isFetching', true);
    },

    [`GET_${TYPE}_LIST_COMPLETED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('data', action.payload._immutableData);
    },

    [`GET_${TYPE}_LIST_FAILED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('error', action.payload);
    },

    [`DESTROY_${TYPE}`]: (state, action) => {
      const id = action.meta;
      return state.updateIn(['data', 'results'], data => {
        return data.filter(item => item.get('id') !== id);
      });
    },

    [`CLEAR_${TYPE}_LIST`]: () => {
      return struct;
    }

  };
  if (extraReducers) {
    reducerMap = Object.assign(reducerMap, extraReducers);
  }
  return handleActions(reducerMap, struct);
};


export const createDetailReducer = (TYPE, extraReducers, struct = detailStructure) => {
  let reducerMap = {

    [`GET_${TYPE}`]: (state) => {
      return state.set('isFetching', true);
    },

    [`GET_${TYPE}_COMPLETED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('data', action.payload._immutableData);
    },

    [`GET_${TYPE}_FAILED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('error', action.payload);
    },

    [`SAVE_${TYPE}`]: (state) => {
      return state.set('isSending', true);
    },

    [`SAVE_${TYPE}_COMPLETED`]: (state, action) => {
      return struct
        .set('isSending', false)
        .set('data', action.payload._immutableData);
    },

    [`SAVE_${TYPE}_FAILED`]: (state, action) => {
      return state
        .set('isSending', false)
        .set('error', action.payload);
    },

    [`DESTROY_${TYPE}`]: (state, action) => {
      const id = action.meta;
      if (state.getIn(['data', 'id']) === id) {
        return struct;
      }
      return state;
    },

    [`CLEAR_${TYPE}`]: () => {
      return struct;
    }

  };
  if (extraReducers) {
    reducerMap = Object.assign(reducerMap, extraReducers);
  }
  return handleActions(reducerMap, struct);
};


export const createMetaReducer = (TYPE, extraReducers, struct = metaStructure) => {
  let reducerMap = {

    [`GET_${TYPE}_META`]: (state) => {
      return state.set('isFetching', true);
    },

    [`GET_${TYPE}_META_COMPLETED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('data', action.payload._immutableData);
    },

    [`GET_${TYPE}_META_FAILED`]: (state, action) => {
      return state
        .set('isFetching', false)
        .set('error', action.payload);
    }

  };
  if (extraReducers) {
    reducerMap = Object.assign(reducerMap, extraReducers);
  }
  return handleActions(reducerMap, struct);
};


export const createUploadReducer = (TYPE, extraReducers, struct = uploadStructure) => {
  let reducerMap = {

    [`${TYPE}_UPLOAD`]: (state, action) => {
      let uploads = state.get('uploads').concat(Immutable.fromJS(action.payload));
      return state.set('uploads', uploads);
    },

    [`${TYPE}_UPLOAD_PROGRESS`]: (state, action) => {
      let uploadState = Immutable.fromJS(action.payload);
      let uploads = state.get('uploads');
      let index = uploads.findIndex(
        _uploadedState => _uploadedState.get('uploadId') === uploadState.get('uploadId')
      );
      uploads = uploads.set(index, uploadState);
      return state.set('uploads', uploads);
    },

    [`${TYPE}_UPLOAD_COMPLETE`]: (state, action) => {
      let uploadState = Immutable.fromJS(action.payload);
      let uploads = state.get('uploads');
      let index = uploads.findIndex(
        _uploadedState => _uploadedState.get('uploadId') === uploadState.get('uploadId')
      );
      uploads = uploads.set(index, uploadState);
      return state.set('uploads', uploads);
    },

    [`${TYPE}_UPLOAD_FAILED`]: (state, action) => {
      let uploadState = Immutable.fromJS(action.payload);
      let uploads = state.get('uploads');
      let index = uploads.findIndex(
        _uploadedState => _uploadedState.get('uploadId') === uploadState.get('uploadId')
      );
      uploads = uploads.set(index, uploadState);
      return state.set('uploads', uploads);
    }

  };
  if (extraReducers) {
    reducerMap = Object.assign(reducerMap, extraReducers);
  }
  return handleActions(reducerMap, struct);
};
