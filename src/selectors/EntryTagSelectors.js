
const listData = (state) => {
  return state.getIn(['entryTag', 'list', 'data']);
};


const listIsFetching = (state) => {
  return state.getIn(['entryTag', 'list', 'isFetching']);
};


export default {
  listData,
  listIsFetching
};
