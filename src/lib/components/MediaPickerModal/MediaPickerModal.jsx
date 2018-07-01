import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import MediaActions from 'actions/MediaActions';
import MediaSelectors from 'selectors/MediaSelectors';
import { List as IList } from 'immutable';
import { immutableMove } from 'lib/utils/ImmutableUtils';
import Button from 'lib/components/Button';
import IconButton from 'lib/components/IconButton';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import MediaItem from 'lib/components/MediaItem';
import List from 'lib/components/List';
import CheckboxListItem from 'lib/components/CheckboxListItem';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import { Motion, spring } from 'react-motion';
import s from './MediaPickerModal.css';


const springConfig = { stiffness: 180, damping: 18 };

class MediaPickerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      media: IList(),
      selectedMedia: this.props.initialSelectedMedia || IList(),
      search: ''
    };
    this.listMedia = this.listMedia.bind(this);
    this.onOkClickHandler = this.onOkClickHandler.bind(this);
    this.onSearchChange = _.debounce(this.onSearchChange.bind(this), 500);
    this.onSelectToggle = this.onSelectToggle.bind(this);
    this.mediaIsSelected = this.mediaIsSelected.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.media !== this.state.media) {
      state.media = nextProps.media;
    }
    if (!this.props.isOpened && nextProps.isOpened) {
      this.listMedia();
      state.selectedMedia = nextProps.initialSelectedMedia || IList();
    }
    this.setState(state);
  }

  listMedia(page) {
    const queryParams = {
      search: this.state.search,
      page: page
    };
    this.props.listMedia(
      this.props.projectId, queryParams
    );
  }

  onOkClickHandler() {
    this.props.onAccept(this.state.selectedMedia);
  }

  onSearchChange(value) {
    this.setState({ search: value }, this.listMedia);
  }

  onSelectToggle(mediaItem, selected) {
    let selectedMedia = this.state.selectedMedia;
    if (selected) {
      selectedMedia = selectedMedia.push(mediaItem);
    } else {
      selectedMedia = selectedMedia.filter(_mediaItem => _mediaItem.id !== mediaItem.id);
    }
    this.setState({ selectedMedia });
  }

  mediaIsSelected(mediaItem) {
    const selectedMediaIds = this.state.selectedMedia.map(item => item.id);
    return selectedMediaIds.includes(mediaItem.id);
  }

  onMove(fromIndex, toIndex) {
    const selectedMedia = immutableMove(this.state.selectedMedia, fromIndex, toIndex);
    this.setState({ selectedMedia });
  }

  render() {
    let { media } = this.state;
    const selectedMedia = this.state.selectedMedia.toJS();
    const {
      excludedMediaIds, onCancel, isOpened, isFetching,
      page, totalPages, projectId
    } = this.props;

    const footer = [
      <Button
        key="cancel-button"
        btnStyle="link"
        onClick={onCancel}
      >
        Cancel
      </Button>,
      <Button
        key="ok-button"
        btnStyle="primary"
        onClick={this.onOkClickHandler}
      >
        OK
      </Button>
    ];

    media = media.filter(mediaItem => {
      return !_.includes(excludedMediaIds, mediaItem.get('id'));
    }).toJS();

    var leftColumnContent;
    if (isFetching) {
      leftColumnContent = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else {
      const items = media.map(mediaItem => {
        return (
          <CheckboxListItem
            key={mediaItem.id}
            onChange={_.partial(this.onSelectToggle, mediaItem)}
            checked={this.mediaIsSelected(mediaItem)}
          >
            <MediaItem
              key={mediaItem.id}
              data={mediaItem}
              projectId={projectId}
              imageHolderClassName={s.imageHolder}
              inline
              editDisabled
            />
          </CheckboxListItem>
        );
      });

      if (totalPages > 1) {
        let previousButton;
        let nextButton;
        if (page > 1) {
          previousButton = (
            <IconButton
              icon="arrow-left"
              onClick={_.partial(this.listMedia, page - 1)}
              buttonGroup
            >
              Previous page
            </IconButton>
          );
        }
        if (page < totalPages) {
          nextButton = (
            <IconButton
              icon="arrow-right"
              onClick={_.partial(this.listMedia, page + 1)}
              buttonGroup
              alignIconRight
            >
              Next page
            </IconButton>
          );
        }
        items.push(
          <li className={s.buttonsItem} key="buttons">
            { previousButton }
            { nextButton }
          </li>
        );
      }

      leftColumnContent = (
        <List className={s.list}>{ items }</List>
      );
    }

    return (
      <Modal
        title="Media"
        onClickClose={onCancel}
        footer={footer}
        isOpened={isOpened}
        wide
      >
        <div className={s.controls}>
          <div className={s.column}>
            <Input
              className={s.searchInput}
              type="search"
              name="search"
              placeholder="Search"
              onChange={this.onSearchChange}
            />
          </div>
        </div>

        <div className={s.listHolder}>
          <div className={s.column}>
            { leftColumnContent }
          </div>
          <div className={s.column}>
            <List className={s.list}>
              {
                selectedMedia.map((mediaItem, i) => {
                  return (
                    <Motion key={mediaItem.id} style={{ y: spring(i * 93, springConfig) }}>
                      {
                        interpolatingStyle => {
                          return (
                            <CheckboxListItem
                              style={{transform: `translateY(${interpolatingStyle.y}px)`}}
                              className={s.listItem}
                              onChange={_.partial(this.onSelectToggle, mediaItem)}
                              checked={this.mediaIsSelected(mediaItem)}
                              onClickUp={_.partial(this.onMove, i, i - 1)}
                              onClickDown={_.partial(this.onMove, i, i + 1)}
                              upButtonDisabled={i === 0}
                              downButtonDisabled={i === selectedMedia.length - 1}
                            >
                              <MediaItem
                                key={mediaItem.id}
                                data={mediaItem}
                                projectId={projectId}
                                imageHolderClassName={s.imageHolder}
                                inline
                                editDisabled
                              />
                            </CheckboxListItem>
                          );
                        }
                      }
                    </Motion>
                  );
                })
              }
            </List>
          </div>
        </div>
      </Modal>
    );
  }
}

MediaPickerModal.propTypes = {
  media: PropTypes.instanceOf(IList).isRequired,
  isFetching: PropTypes.bool,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  maxSelections: PropTypes.number.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  listMedia: PropTypes.func.isRequired,
  excludedMediaIds: PropTypes.array,
  initialSelectedMedia: PropTypes.instanceOf(IList),
  isOpened: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    media: MediaSelectors.listResults(state),
    isFetching: MediaSelectors.listIsFetching(state),
    page: MediaSelectors.listData(state).get('page'),
    totalPages: MediaSelectors.listData(state).get('totalPages')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listMedia: (projectId, queryParams) => {
      dispatch(MediaActions.list(projectId, queryParams));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaPickerModal);
