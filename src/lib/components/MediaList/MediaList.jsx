import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import List from 'lib/components/List';
import MediaItem from 'lib/components/MediaItem';
import s from './MediaList.css';


class MediaList extends Component {
  render() {
    const {
      media,
      onItemClick,
      projectId,
      editDisabled,
      selectedMedia
    } = this.props;
    let { className } = this.props;
    className = classnames(s.mediaList, className);
    return (
      <List className={className}>
        {
          media.map(mediaItem => {
            return (
              <li className={s.item} key={mediaItem.id}>
                <MediaItem
                  onClick={onItemClick}
                  projectId={projectId}
                  data={mediaItem}
                  editDisabled={editDisabled}
                  selected={
                    _.includes(
                      selectedMedia.map(media => media.id),
                      mediaItem.id
                    )
                  }
                />
              </li>
            );
          })
        }
      </List>
    );
  }
}

MediaList.propTypes = {
  projectId: PropTypes.string.isRequired,
  selectedMedia: PropTypes.array.isRequired,
  media: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  editDisabled: PropTypes.bool
};

MediaList.defaultProps = {
  editDisabled: false
};

export default MediaList;
