import { handleActions } from 'redux-actions';
import moment from 'moment';
import _ from 'lodash';
import Immutable, { Map, List } from 'immutable';
import { paginatedListStructure, detailStructure } from './lib/utilities';
import {
  SAVE_ENTRY,
  GET_ENTRY_LIST,
  GET_ENTRY,
  DESTROY_ENTRY,
  CLEAR_ACTIVE_ENTRY,
  CLEAR_ENTRIES,
  BULK_DESTROY_ENTRIES,
  SELECT_ALL_ENTRIES,
  SELECT_NONE_ENTRIES,
  TOGGLE_SELECT_ENTRY
} from 'actions/EntryActions';

const initialEntryDetail = detailStructure.mergeIn(['data'], {
  name: '',
  fields: Map(),
  published: moment().toISOString(),
  tags: List()
});

const initialEntryList = paginatedListStructure.set('queryParams', null);

const initialState = Map({
  entryDetail: initialEntryDetail,
  entryList: initialEntryList,
  selectedEntries: List()
});

export default handleActions(
  {
    [SAVE_ENTRY]: (state, action) => {
      // We optimistically merge data.
      return state.set(
        'entryDetail',
        initialEntryDetail.merge({ data: action.meta, isSending: true })
      );
    },

    [`${SAVE_ENTRY}_COMPLETED`]: (state, action) => {
      return state.set(
        'entryDetail',
        initialEntryDetail.set('data', action.payload._immutableData)
      );
    },

    [`${SAVE_ENTRY}_FAILED`]: (state, action) => {
      return state
        .setIn(['entryDetail', 'error'], action.payload)
        .setIn(['entryDetail', 'isSending'], false);
    },

    [GET_ENTRY_LIST]: (state, action) => {
      return state.mergeIn(['entryList'], {
        isFetching: true,
        queryParams: action.meta.queryParams,
        error: Map()
      });
    },

    [`${GET_ENTRY_LIST}_COMPLETED`]: (state, action) => {
      return state.merge({
        entryList: initialEntryList.set('data', action.payload._immutableData),
        selectedEntries: List()
      });
    },

    [`${GET_ENTRY_LIST}_FAILED`]: (state, action) => {
      return state.setIn(['entryList', 'error'], action.payload).set('selectedEntries', List());
    },

    [GET_ENTRY]: state => {
      return state.set('entryDetail', initialEntryDetail.set('isFetching', true));
    },

    [`${GET_ENTRY}_COMPLETED`]: (state, action) => {
      return state.set(
        'entryDetail',
        initialEntryDetail.set('data', action.payload._immutableData)
      );
    },

    [`${GET_ENTRY}_FAILED`]: (state, action) => {
      return state.set('entryDetail', initialEntryDetail.set('error', action.payload));
    },

    [BULK_DESTROY_ENTRIES]: (state, action) => {
      // Optimistically delete
      const ids = action.meta;
      const results = state.getIn(['entryList', 'data', 'results']).filter(item => {
        return !_.includes(ids, item.get('id'));
      });
      const count = results.count();
      return state.mergeIn(['entryList', 'data'], { count, results });
    },

    [DESTROY_ENTRY]: (state, action) => {
      // Optimistic delete
      const entry = action.meta;
      const results = state.getIn(['entryList', 'data', 'results']).filter(item => {
        return entry.id !== item.get('id');
      });
      const count = results.count();
      let newState = state.mergeIn(['entryList', 'data'], { count, results });
      if (newState.getIn(['entryDetail', 'data']).id === entry.id) {
        newState = newState.set('entryDetail', initialEntryDetail);
      }
      return newState;
    },

    [CLEAR_ACTIVE_ENTRY]: state => {
      return state.set('entryDetail', initialEntryDetail);
    },

    [CLEAR_ENTRIES]: state => {
      return state.merge({
        entryList: initialEntryList,
        selectedEntries: List()
      });
    },

    [TOGGLE_SELECT_ENTRY]: (state, action) => {
      const entry = Immutable.fromJS(action.payload);
      const selectedEntries = state.get('selectedEntries');
      const index = selectedEntries.findIndex(_media => _media.get('id') === entry.get('id'));
      if (index === -1) {
        state = state.set('selectedEntries', selectedEntries.push(entry));
      } else {
        state = state.set('selectedEntries', selectedEntries.delete(index));
      }
      return state;
    },

    [SELECT_ALL_ENTRIES]: state => {
      return state.set('selectedEntries', state.getIn(['entryList', 'data', 'results']));
    },

    [SELECT_NONE_ENTRIES]: state => {
      return state.set('selectedEntries', List());
    }
  },
  initialState
);
