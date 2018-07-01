import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import { List } from 'immutable';
import queryString from 'query-string';
import MediaSelectors from 'selectors/MediaSelectors';
import Dropzone from 'lib/components/Dropzone';
import MediaActions from 'actions/MediaActions';
import Input from 'lib/components/Input';
import Pagination from 'lib/components/Pagination';
import IconButton from 'lib/components/IconButton';
import Button from 'lib/components/Button';
import ConfirmModal from 'lib/components/ConfirmModal';
import ContentHeader from 'lib/components/ContentHeader';
import MediaList from 'lib/components/MediaList';
import UploadsList from './components/UploadsList';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import s from './Media.css';


const resultsPerPageChoices = [
  '20',
  '50',
  '100'
];

const orderByChoices = [
  { label: 'Created (ascending)', value: 'createdAt'},
  { label: 'Created', value: '-createdAt'},
  { label: 'Modified (ascending)', value: 'modifiedAt'},
  { label: 'Modified', value: '-modifiedAt'}
];

class Media extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      page: 1,
      pageSize: resultsPerPageChoices[0],
      search: '',
      orderBy: orderByChoices[1].value
    };
    this.listMedia = this.listMedia.bind(this);
    this.listMediaDebounced = _.debounce(this.listMedia.bind(this), 500);
    this.onDrop = this.onDrop.bind(this);
    this.onPaginationClick = this.onPaginationClick.bind(this);
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onDeleteSelected = this.onDeleteSelected.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onOrderByChange = this.onOrderByChange.bind(this);
  }

  listMedia() {
    this.props.listMedia(
      this.props.params.project_id,
      {
        page: this.state.page,
        pageSize: this.state.pageSize,
        search: _.trim(this.state.search),
        orderBy: this.state.orderBy
      }
    );
    // Update browser history
    const params = queryString.stringify({
      page: this.state.page,
      pageSize: this.state.pageSize,
      search: _.trim(this.state.search),
      orderBy: this.state.orderBy
    });
    // FIXME
    // browserHistory.replace({
    //   pathname: this.props.location.pathname,
    //   search: `?${params}`
    // });
  }

  componentDidMount() {
    // Restore our search state from the url
    const q = this.props.location.query;
    this.setState(
      {
        pageSize: q.pageSize || resultsPerPageChoices[0],
        search: q.search || '',
        page: q.page || 1,
        orderBy: q.orderBy || orderByChoices[1].value
      },
      this.listMedia
    );
  }

  onDrop(files) {
    this.props.upload(this.props.params.project_id, files);
  }

  onPaginationClick(page) {
    this.setState({ page }, this.listMedia);
  }

  onAcceptModal() {
    this.props.bulkDestroyMedia(
      this.props.params.project_id,
      this.props.selectedMedia.map(mediaAsset => mediaAsset.get('id'))
    );
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onDeleteSelected() {
    this.setState({ modalOpen: true });
  }

  onSearch(value) {
    this.setState({ search: value }, this.listMediaDebounced);
  }

  onPageSizeChange(value) {
    this.setState({ pageSize: value, page: 1 }, this.listMedia);
  }

  onOrderByChange(value) {
    this.setState({ orderBy: value.value }, this.listMedia);
  }

  render() {
    const {
      isFetching,
      params,
      toggleSelect,
      selectAll,
      selectNone,
      hasCompletedUploads,
      totalRecords,
      page,
      totalPages
    } = this.props;
    const media = this.props.media.toJS();
    const selectedMedia = this.props.selectedMedia.toJS();
    const uploads = this.props.uploads.toJS();

    let results;
    if (isFetching) {
      results = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else {
      results = (
        <div>
          <p>{ totalRecords } results</p>
          <MediaList
            media={media}
            selectedMedia={selectedMedia}
            projectId={params.project_id}
            onItemClick={toggleSelect}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onClick={this.onPaginationClick}
          />
        </div>
      );
    }

    return (
      <div className={s.media}>
        <ContentHeader title="Media">
          <IconButton
            className={s.reloadButton}
            icon="sync-alt"
            onClick={this.listMedia}
            disabled={isFetching}
          />
          <div className={s.btnGroup}>
            <Button
              onClick={selectAll}
              disabled={isFetching}
              buttonGroup
            >
              Select all
            </Button>
            <Button
              onClick={selectNone}
              disabled={isFetching}
              buttonGroup
            >
              Select none
            </Button>
          </div>
          <IconButton
            icon="trash-alt"
            onClick={this.onDeleteSelected}
            disabled={!selectedMedia.length}
          >
            Delete selected
          </IconButton>
        </ContentHeader>

        <div className={s.body}>
          <div className={s.content}>

            <div className={s.controls}>
              <div className={s.column}>
                <Input
                  className={s.searchInput}
                  type="search"
                  name="media-search"
                  label="Search"
                  placeholder="Search"
                  onChange={this.onSearch}
                />
              </div>
              <div className={s.column}>
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
                  disabled={isFetching || !media.length}
                />
              </div>
              <div className={s.column}>
                <Input
                  type="select"
                  name="pageSize"
                  label="Results per page"
                  placeholder="Results per page"
                  choices={resultsPerPageChoices}
                  value={this.state.pageSize}
                  onChange={this.onPageSizeChange}
                  disabled={isFetching || !media.length}
                />
              </div>
            </div>

            { results }
          </div>

          <div className={s.sidebar}>
            <Dropzone onDrop={this.onDrop} />
            {
              hasCompletedUploads ?
                <Button
                  className={s.clearCompletedButton}
                  btnStyle="link"
                  onClick={this.props.clearCompletedUploads}
                  block
                >
                  Clear completed
                </Button> :
                null
            }

            <UploadsList uploads={uploads} />
          </div>
        </div>

        <ConfirmModal
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        >
          <span>
            Are you sure you want to <strong>permanently</strong> delete
            the {selectedMedia.length} selected items?
          </span>
        </ConfirmModal>
      </div>
    );
  }

}

Media.propTypes = {
  listMedia: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  bulkDestroyMedia: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
  toggleSelect: PropTypes.func.isRequired,
  clearCompletedUploads: PropTypes.func.isRequired,
  hasCompletedUploads: PropTypes.bool.isRequired,
  selectedMedia: PropTypes.instanceOf(List).isRequired,
  params: PropTypes.object.isRequired,
  media: PropTypes.instanceOf(List).isRequired,
  totalRecords: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  uploads: PropTypes.instanceOf(List).isRequired
};

const mapStateToProps = (state) => {
  return {
    media: MediaSelectors.listResults(state),
    totalRecords: MediaSelectors.listData(state).get('totalRecords'),
    page: MediaSelectors.listData(state).get('page'),
    totalPages: MediaSelectors.listData(state).get('totalPages'),
    isFetching: MediaSelectors.listIsFetching(state),
    selectedMedia: MediaSelectors.selectedMedia(state),
    uploads: MediaSelectors.uploads(state),
    hasCompletedUploads: MediaSelectors.numCompletedUploads(state) > 0
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listMedia: (projectId, queryParams) => {
      dispatch(MediaActions.list(projectId, queryParams));
    },
    upload: (projectId, files) => {
      dispatch(MediaActions.upload(projectId, files));
    },
    clearCompletedUploads: () => {
      dispatch(MediaActions.clearCompletedUploads());
    },
    bulkDestroyMedia: (projectId, mediaAssetIds) => {
      dispatch(MediaActions.bulkDestroy(projectId, mediaAssetIds));
    },
    selectAll: () => {
      dispatch(MediaActions.selectAll());
    },
    selectNone: () => {
      dispatch(MediaActions.selectNone());
    },
    toggleSelect: (media) => {
      dispatch(MediaActions.toggleSelect(media));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Media);
