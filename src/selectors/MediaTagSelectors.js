const listData = state => {
  return state.getIn(['mediaTag', 'list', 'data']);
};

const listIsFetching = state => {
  return state.getIn(['mediaTag', 'list', 'isFetching']);
};

export default {
  listData,
  listIsFetching
};
