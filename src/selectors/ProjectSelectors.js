import { createSelectors, createDetailSelectors } from './lib/utilities';

const extraReducers = createDetailSelectors('project', 'updateMember');

export default createSelectors('project', extraReducers);
