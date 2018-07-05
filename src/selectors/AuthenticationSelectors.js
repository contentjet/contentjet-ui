
const authentication = (state) => {
  return state.get('authentication');
};

const isAuthenticated = (state) => {
  return state.getIn(['authentication', 'data', 'isAuthenticated']);
};

const isSending = (state) => {
  return state.getIn(['authentication', 'isSending']);
};

const error = (state) => {
  return state.getIn(['authentication', 'error']);
};

export default {
  authentication,
  isAuthenticated,
  isSending,
  error
};
