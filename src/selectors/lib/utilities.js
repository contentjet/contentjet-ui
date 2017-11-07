import { createSelector } from 'reselect';
import { List } from 'immutable';


export function createListSelectors(reducerKey, listKey = 'list') {

  const list = (state) => {
    return state.getIn([reducerKey, listKey]);
  };

  const listData = createSelector(
    list,
    (list) => {
      return list.get('data');
    }
  );

  const listDataResults = createSelector(
    listData,
    (listData) => {
      return listData.get('results');
    }
  );

  const listIsFetching = createSelector(
    list,
    (list) => {
      return list.get('isFetching');
    }
  );

  return {
    [`${listKey}Data`]: listData,
    [`${listKey}DataResults`]: listDataResults,
    [`${listKey}IsFetching`]: listIsFetching
  };

}


export function createDetailSelectors(reducerKey, detailKey = 'detail') {

  const detail = (state) => {
    return state.getIn([reducerKey, detailKey]);
  };

  const detailData = createSelector(
    detail,
    (detail) => {
      return detail.get('data');
    }
  );

  const detailError = createSelector(
    detail,
    (detail) => {
      return detail.get('error');
    }
  );

  const detailIsSending = createSelector(
    detail,
    (detail) => {
      return detail.get('isSending');
    }
  );

  const detailIsFetching = createSelector(
    detail,
    (detail) => {
      return detail.get('isFetching');
    }
  );

  return {
    [`${detailKey}Data`]: detailData,
    [`${detailKey}Error`]: detailError,
    [`${detailKey}IsSending`]: detailIsSending,
    [`${detailKey}IsFetching`]: detailIsFetching
  };

}


export function createMetaSelectors(reducerKey, metaKey = 'meta') {

  const meta = (state) => {
    return state.getIn([reducerKey, metaKey]);
  };

  const metaData = createSelector(
    meta,
    (meta) => {
      return meta.get('data');
    }
  );

  const fieldChoices = (state, field) => {
    return metaData(state).getIn(['actions', 'POST', field, 'choices'], List());
  };

  const hasPermission = (state, permission) => {
    if (typeof permission === 'string') {
      permission = [permission];
    }
    return !!permission.find(perm => {
      return metaData(state).get('permissions', List()).includes(perm);
    });
  };

  const metaIsFetching = createSelector(
    meta,
    (meta) => {
      return meta.get('isFetching');
    }
  );

  return {
    fieldChoices,
    hasPermission,
    metaIsFetching
  };

}


export function createSelectors(reducerKey, extraReducers = {}) {
  return Object.assign(
    createListSelectors(reducerKey),
    createDetailSelectors(reducerKey),
    createMetaSelectors(reducerKey),
    extraReducers
  );
}
