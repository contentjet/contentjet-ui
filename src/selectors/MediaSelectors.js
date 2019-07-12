const listResults = state => {
  return state.getIn(['media', 'mediaList', 'data', 'results']);
};

const listData = state => {
  return state.getIn(['media', 'mediaList', 'data']);
};

const listIsFetching = state => {
  return state.getIn(['media', 'mediaList', 'isFetching']);
};

const selectedMedia = state => {
  return state.getIn(['media', 'selectedMedia']);
};

const uploads = state => {
  return state.getIn(['media', 'uploads']);
};

const numCompletedUploads = state => {
  let count = 0;
  uploads(state).forEach(upload => {
    if (upload.get('status') !== 'UPLOADING') {
      count++;
    }
  });
  return count;
};

const detailData = state => {
  return state.getIn(['media', 'mediaDetail', 'data']);
};

const detailError = state => {
  return state.getIn(['media', 'mediaDetail', 'error']);
};

const detailIsFetching = state => {
  return state.getIn(['media', 'mediaDetail', 'isFetching']);
};

const detailIsSending = state => {
  return state.getIn(['media', 'mediaDetail', 'isSending']);
};

export default {
  listResults,
  listData,
  listIsFetching,
  selectedMedia,
  uploads,
  numCompletedUploads,
  detailData,
  detailError,
  detailIsFetching,
  detailIsSending
};
