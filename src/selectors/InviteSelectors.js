import { createSelectors } from './lib/utilities';

const selectors = createSelectors('invite');

selectors.inviteToken = state => {
  return state.getIn(['invite', 'detail', 'inviteToken']);
};

export default selectors;
