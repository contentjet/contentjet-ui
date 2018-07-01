import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MediaSelectors from 'selectors/MediaSelectors';
import MediaTagSelectors from 'selectors/MediaTagSelectors';
import NotificationSelectors from 'selectors/NotificationSelectors';
import { List, Map, fromJS } from 'immutable';
import _ from 'lodash';
import slugify from 'underscore.string/slugify';
import MediaActions from 'actions/MediaActions';
import MediaTagActions from 'actions/MediaTagActions';
import { Link } from 'react-router';
import Input from 'lib/components/Input';
import ConfirmModal from 'lib/components/ConfirmModal';
import Button from 'lib/components/Button';
import ContentHeader from 'lib/components/ContentHeader';
import MediaImage from './components/MediaImage';
import Notification from 'lib/components/Notification';
import s from './MediaEditor.css';


// Code lifted from here
// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals) {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

class MediaEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      media: this.props.media,
      mediaTags: this.props.mediaTags,
      confirmDeleteModalOpen: false
    };
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (nextProps.media !== this.state.media) {
      newState.media = nextProps.media;
    }
    if (nextProps.mediaTags !== this.state.mediaTags) {
      newState.mediaTags = nextProps.mediaTags;
    }
    if (!_.isEmpty(newState)) this.setState(newState);
  }

  componentDidMount() {
    this.props.listMediaTags(this.props.params.project_id);
    this.props.getMedia(
      this.props.params.project_id,
      this.props.params.media_id
    );
  }

  onSaveClick() {
    this.props.saveMedia(
      this.props.params.project_id,
      this.state.media.toJS()
    );
  }

  onCancelModal() {
    this.setState({ confirmDeleteModalOpen: false });
  }

  onConfirmDelete() {
    this.props.deleteMedia(
      this.props.params.project_id,
      this.state.media.toJS()
    );
    this.setState({ confirmDeleteModalOpen: false });
  }

  onDeleteClick() {
    this.setState({ confirmDeleteModalOpen: true });
  }

  onFieldChange(value, name) {
    this.setState({
      media: this.state.media.set(name, fromJS(value))
    });
  }

  onCreateTag(name) {
    const newTag = slugify(name);
    let tags = this.state.media.get('tags', List());
    if (!tags.contains(newTag)) {
      tags = tags.push(newTag);
      this.setState({
        media: this.state.media.set('tags', tags)
      });
    }
  }

  render() {
    const { isFetching, isSending } = this.props;
    const err = this.props.err.toJS();

    if (isFetching) return null;

    const media = this.state.media.toJS();
    const mediaTags = this.state.mediaTags.toJS();

    return (
      <div className={s.mediaEditor}>
        <ContentHeader title="Media editor">
          <Link
            className={s.cancelButton}
            to={`/project/${this.props.params.project_id}/media/`}
          >
            Cancel
          </Link>
          <Button
            btnStyle="link"
            onClick={this.onDeleteClick}
            disabled={isSending}
          >
            Delete
          </Button>
          <Button
            btnStyle="primary"
            onClick={this.onSaveClick}
            processing={isSending}
            disabled={isSending}
          >
            Save
          </Button>
        </ContentHeader>

        <div className={s.body}>
          <div className={s.content}>
            <div className={s.mediaHolder}>
              <MediaImage media={media} />
            </div>
            <div className={s.mediaMeta}>
              <div className={s.mediaName}>{_.get(media, 'name')}</div>
              <div className={s.mediaSize}>{formatBytes(_.get(media, 'size', 0))}</div>
            </div>
            <Input
              name="description"
              label="Description"
              placeholder="Description"
              type="text"
              errors={_.get(err, 'errors.description')}
              value={_.get(media, 'description')}
              onChange={this.onFieldChange}
            />
            <Input
              name="tags"
              label="Tags"
              placeholder="Tags"
              type="multi-select"
              errors={_.get(err, 'errors.tags')}
              value={_.get(media, 'tags')}
              data={mediaTags}
              onChange={this.onFieldChange}
              onCreate={this.onCreateTag}
            />
          </div>
        </div>

        <Notification {...this.props.notification.toJS()} />
        <ConfirmModal
          onAccept={this.onConfirmDelete}
          onCancel={this.onCancelModal}
          isOpened={this.state.confirmDeleteModalOpen}
        >
          <span>
            Are you sure you want to <strong>permanently</strong> delete this asset?
          </span>
        </ConfirmModal>
      </div>
    );
  }

}
MediaEditor.propTypes = {
  media: PropTypes.instanceOf(Map).isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSending: PropTypes.bool.isRequired,
  mediaTags: PropTypes.instanceOf(List).isRequired,
  notification: PropTypes.instanceOf(Map).isRequired,
  listMediaTags: PropTypes.func.isRequired,
  getMedia: PropTypes.func.isRequired,
  saveMedia: PropTypes.func.isRequired,
  deleteMedia: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
  return {
    media: MediaSelectors.detailData(state),
    err: MediaSelectors.detailError(state),
    isFetching: MediaSelectors.detailIsFetching(state),
    isSending: MediaSelectors.detailIsSending(state),
    mediaTags: MediaTagSelectors.listData(state),
    notification: NotificationSelectors.getNotification(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    listMediaTags: (projectId) => {
      dispatch(MediaTagActions.list(projectId));
    },
    getMedia: (projectId, mediaId) => {
      dispatch(MediaActions.get(projectId, mediaId));
    },
    saveMedia: (projectId, data) => {
      dispatch(MediaActions.save(projectId, data));
    },
    deleteMedia: (projectId, data) => {
      dispatch(MediaActions.destroy(projectId, data));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaEditor);
