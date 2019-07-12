const listData = state => {
  return state.getIn(['entry', 'entryList', 'data']);
};

const listIsFetching = state => {
  return state.getIn(['entry', 'entryList', 'isFetching']);
};

const listDataResults = state => {
  return state.getIn(['entry', 'entryList', 'data', 'results']);
};

const detail = state => {
  return state.getIn(['entry', 'entryDetail']);
};

const detailData = state => {
  return state.getIn(['entry', 'entryDetail', 'data']);
};

const detailError = state => {
  return state.getIn(['entry', 'entryDetail', 'error']);
};

const detailIsFetching = state => {
  return state.getIn(['entry', 'entryDetail', 'isFetching']);
};

const detailIsSending = state => {
  return state.getIn(['entry', 'entryDetail', 'isSending']);
};

const selectedEntries = state => {
  return state.getIn(['entry', 'selectedEntries']);
};

export default {
  listData,
  listIsFetching,
  listDataResults,
  detail,
  detailData,
  detailError,
  detailIsFetching,
  detailIsSending,
  selectedEntries
};
