import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import _ from 'lodash';
import { List } from 'immutable';
import EntrySelectors from 'selectors/EntrySelectors';
import EntryTypeSelectors from 'selectors/EntryTypeSelectors';
import EntryActions from 'actions/EntryActions';
import EntryTypeActions from 'actions/EntryTypeActions';
import Input from 'lib/components/Input';
import Alert from 'lib/components/Alert';
import ContentHeader from 'lib/components/ContentHeader';
import EntriesTable from 'lib/components/EntriesTable';
import NewEntryDropdownButton from './components/NewEntryDropdownButton';
import IconButton from 'lib/components/IconButton';
import Pagination from 'lib/components/Pagination';
import Button from 'lib/components/Button';
import ConfirmModal from 'lib/components/ConfirmModal';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import s from './Entries.css';


const resultsPerPageChoices = [
  '20',
  '50',
  '100'
];

const anyEntryType = { name: '--- Any ---', id: '-1' };

const orderByChoices = [
  { label: 'Created (ascending)', value: 'createdAt' },
  { label: 'Created', value: '-createdAt' },
  { label: 'Modified (ascending)', value: 'modifiedAt' },
  { label: 'Modified', value: '-modifiedAt' }
];

class Entries extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      entryTypeFilter: anyEntryType,
      pageSize: resultsPerPageChoices[0],
      selectedEntries: [],
      modalOpen: false,
      search: ''
    };
    this.listEntries = this.listEntries.bind(this);
    this.listEntriesDebounced = _.debounce(this.listEntries.bind(this), 250);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onPaginationClick = this.onPaginationClick.bind(this);
    this.onPaginationNext = this.onPaginationNext.bind(this);
    this.onPaginationPrevious = this.onPaginationPrevious.bind(this);
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onEntryTypeFilterChange = this.onEntryTypeFilterChange.bind(this);
    this.onOrderByChange = this.onOrderByChange.bind(this);
  }

  componentDidMount() {
    const { match, location } = this.props;
    this.props.listEntryTypes(match.params.project_id);
    // Restore our search state from the url
    const q = queryString.parse(location.search);
    this.setState(
      {
        pageSize: q.pageSize || resultsPerPageChoices[0],
        search: q.search || '',
        page: q.page || 1,
        entryTypeFilter: { name: '', id: q.entryType },
        orderBy: q.orderBy || orderByChoices[3].value
      },
      this.listEntries
    );
  }

  componentWillUnmount() {
    this.props.clearEntries();
  }

  listEntries() {
    let entryTypeId = _.get(this.state.entryTypeFilter, 'id');
    if (entryTypeId === '-1') entryTypeId = null;
    this.props.listEntries(
      this.props.match.params.project_id,
      {
        page: this.state.page,
        pageSize: this.state.pageSize,
        entryType: entryTypeId,
        search: _.trim(this.state.search),
        nonPublished: 1, // We list both published and non-published entries
        orderBy: this.state.orderBy
      }
    );
    // Update browser history
    const params = queryString.stringify({
      page: this.state.page,
      pageSize: this.state.pageSize,
      entryType: entryTypeId || '',
      search: _.trim(this.state.search),
      orderBy: this.state.orderBy
    });
    this.props.history.replace({
      pathname: this.props.location.pathname,
      search: `?${params}`
    });
  }

  onSearchChange(value) {
    this.setState({ search: value }, this.listEntriesDebounced);
  }

  onPaginationClick(page) {
    this.setState({ page }, this.listEntries);
  }

  onPaginationNext() {
    const page = this.state.page + 1;
    this.setState({ page }, this.listEntries);
  }

  onPaginationPrevious() {
    const page = this.state.page - 1;
    this.setState({ page }, this.listEntries);
  }

  onAcceptModal() {
    this.props.bulkDestroyEntries(
      this.props.match.params.project_id,
      this.props.selectedEntries.map(entry => entry.get('id')).toArray()
    );
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onDeleteSelected() {
    this.setState({ modalOpen: true });
  }

  onPageSizeChange(value) {
    this.setState({ pageSize: value, page: 1 }, this.listEntries);
  }

  onEntryTypeFilterChange(value) {
    this.setState({ entryTypeFilter: value, page: 1 }, this.listEntries);
  }

  onOrderByChange(value) {
    this.setState({ orderBy: value.value }, this.listEntries);
  }

  render() {
    const {
      entriesIsFetching,
      toggleSelect,
      match,
      currentPage,
      totalPages,
      totalRecords,
      selectAll,
      selectNone
    } = this.props;
    const entries = this.props.entries.toJS();
    const selectedEntries = this.props.selectedEntries.toJS();
    const entryTypes = this.props.entryTypes.toJS();
    const entryTypeChoices = [anyEntryType].concat(entryTypes || []);

    let body;
    if (entriesIsFetching) {
      body = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else if (entryTypes.length) {
      body = (
        <div className={s.body}>
          <p>{`${totalRecords} results`}</p>
          <EntriesTable
            className={s.entriesTable}
            entries={entries}
            selectedEntries={selectedEntries}
            toggleSelect={toggleSelect}
            projectId={match.params.project_id}
          />
          <Pagination
            className={s.pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            onClick={this.onPaginationClick}
            onNext={this.onPaginationNext}
            onPrevious={this.onPaginationPrevious}
          />
        </div>
      );
    } else {
      body = (
        <div className={s.body}>
          <Alert className={s.alert}>
            You have not yet created any entry types.
          </Alert>
        </div>
      );
    }
    return (
      <div className={s.entries}>
        <ContentHeader title="Entries">
          <IconButton
            className={s.reloadButton}
            icon="sync-alt"
            onClick={this.listEntries}
            disabled={entriesIsFetching}
          />
          <div className={s.btnGroup}>
            <Button
              onClick={selectAll}
              disabled={entriesIsFetching}
              buttonGroup
            >
              Select all
            </Button>
            <Button
              onClick={selectNone}
              disabled={entriesIsFetching}
              buttonGroup
            >
              Select none
            </Button>
          </div>
          <IconButton
            className={s.deleteSelectedButton}
            icon="trash-alt"
            onClick={this.onDeleteSelected}
            disabled={!selectedEntries.length || entriesIsFetching}
          >
            Delete selected
          </IconButton>
          <NewEntryDropdownButton
            entryTypes={entryTypes}
            projectId={match.params.project_id}
          />
        </ContentHeader>

        <div className={s.controls}>
          <div className={s.controlsRow}>
            <div className={s.controlsColumn}>
              <Input
                type="search"
                name="search"
                label="Search"
                placeholder="Search"
                value={this.state.search}
                onChange={this.onSearchChange}
                disabled={!entryTypes.length}
              />
            </div>
            <div className={s.controlsColumn}>
              <Input
                type="select-object"
                name="entryType"
                label="Filter by Entry Type"
                placeholder="Filter by Entry Type"
                value={this.state.entryTypeFilter}
                choices={entryTypeChoices}
                textField="name"
                valueField="id"
                onChange={this.onEntryTypeFilterChange}
                disabled={entriesIsFetching || !entryTypes.length}
              />
            </div>
            <div className={s.controlsColumn}>
              <Input
                type="select-object"
                name="pageSize"
                label="Order by"
                placeholder="Results per page"
                choices={orderByChoices}
                value={this.state.orderBy}
                textField="label"
                valueField="value"
                onChange={this.onOrderByChange}
                disabled={entriesIsFetching || !entryTypes.length}
              />
            </div>
            <div className={s.controlsColumn}>
              <Input
                type="select"
                name="pageSize"
                label="Results per page"
                placeholder="Results per page"
                choices={resultsPerPageChoices}
                value={this.state.pageSize}
                onChange={this.onPageSizeChange}
                disabled={entriesIsFetching || !entryTypes.length}
              />
            </div>
          </div>
        </div>

        {body}

        <ConfirmModal
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        >
          <span>
            Are you sure you want to <strong>permanently</strong> delete
            the {selectedEntries.length} selected entries?
          </span>
        </ConfirmModal>
      </div>
    );
  }

}

Entries.propTypes = {
  listEntryTypes: PropTypes.func.isRequired,
  listEntries: PropTypes.func.isRequired,
  clearEntries: PropTypes.func.isRequired,
  bulkDestroyEntries: PropTypes.func.isRequired,
  entryTypes: PropTypes.instanceOf(List).isRequired,
  entries: PropTypes.instanceOf(List).isRequired,
  entriesIsFetching: PropTypes.bool.isRequired,
  selectedEntries: PropTypes.instanceOf(List).isRequired,
  toggleSelect: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape()
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired
};

const mapStateToProps = (state) => {
  const entryListData = EntrySelectors.listData(state);
  return {
    entryTypes: EntryTypeSelectors.listDataResults(state),
    entries: EntrySelectors.listDataResults(state),
    entriesIsFetching: EntrySelectors.listIsFetching(state),
    selectedEntries: EntrySelectors.selectedEntries(state),
    currentPage: entryListData.get('page'),
    totalPages: entryListData.get('totalPages'),
    totalRecords: entryListData.get('totalRecords')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listEntryTypes: (projectId) => {
      dispatch(EntryTypeActions.list(projectId));
    },
    listEntries: (projectId, queryParams) => {
      dispatch(EntryActions.list(projectId, queryParams));
    },
    clearEntries: () => {
      dispatch(EntryActions.clearEntries());
    },
    bulkDestroyEntries: (projectId, entryIds) => {
      dispatch(EntryActions.bulkDestroy(projectId, entryIds));
    },
    toggleSelect: (entry) => {
      dispatch(EntryActions.toggleSelect(entry));
    },
    selectAll: () => {
      dispatch(EntryActions.selectAll());
    },
    selectNone: () => {
      dispatch(EntryActions.selectNone());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entries);
