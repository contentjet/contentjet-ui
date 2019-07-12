import { Map } from 'immutable';
import ProjectSelectors from './ProjectSelectors';

const requestPasswordReset = state => {
  return state.getIn(['user', 'requestPasswordReset']);
};

const requestPasswordResetError = state => {
  return state.getIn(['user', 'requestPasswordReset', 'error']);
};

const requestPasswordResetIsSending = state => {
  return state.getIn(['user', 'requestPasswordReset', 'isSending']);
};

const signUp = state => {
  return state.getIn(['user', 'signUp']);
};

const signUpError = state => {
  return state.getIn(['user', 'signUp', 'error']);
};

const signUpIsSending = state => {
  return state.getIn(['user', 'signUp', 'isSending']);
};

const setPassword = state => {
  return state.getIn(['user', 'setPassword']);
};

const setPasswordError = state => {
  return state.getIn(['user', 'setPassword', 'error']);
};

const setPasswordIsSending = state => {
  return state.getIn(['user', 'setPassword', 'isSending']);
};

const changePassword = state => {
  return state.getIn(['user', 'changePassword']);
};

const changePasswordError = state => {
  return state.getIn(['user', 'changePassword', 'error']);
};

const changePasswordIsSending = state => {
  return state.getIn(['user', 'changePassword', 'isSending']);
};

const me = state => {
  return state.getIn(['user', 'me', 'data'], new Map());
};

const meError = state => {
  return state.getIn(['user', 'me', 'error'], new Map());
};

const meIsSending = state => {
  return state.getIn(['user', 'me', 'isSending'], false);
};

const meIsFetching = state => {
  return state.getIn(['user', 'me', 'isFetching'], false);
};

const userIsProjectAdmin = state => {
  const user = me(state);
  const project = ProjectSelectors.detailData(state);
  if (user.isEmpty() || project.isEmpty()) return false;
  const userId = user.get('id');
  const projectOwnerId = project.get('userId');
  if (userId === projectOwnerId) return true;
  const adminIds = project
    .get('members')
    .filter(user => user.get('membershipType') === 'admin')
    .map(user => user.get('id'));
  return adminIds.includes(userId);
};

export default {
  requestPasswordReset,
  requestPasswordResetError,
  requestPasswordResetIsSending,
  signUp,
  signUpError,
  signUpIsSending,
  setPassword,
  setPasswordError,
  setPasswordIsSending,
  changePassword,
  changePasswordError,
  changePasswordIsSending,
  me,
  meError,
  meIsSending,
  meIsFetching,
  userIsProjectAdmin
};
