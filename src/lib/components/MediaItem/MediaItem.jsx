import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import FontAwesome from 'lib/components/FontAwesome';
import FileIcon from 'lib/components/FileIcon';
import IconButton from 'lib/components/IconButton';
import s from './MediaItem.css';


const MediaItem = (props) => {
  const { projectId, data, editDisabled, onClick, inline, selected } = props;

  let image;
  if (data.thumbnail) {
    image = (
      <img
        className={s.image}
        src={data.thumbnail}
      />
    );
  } else {
    image = (
      <FileIcon
        className={s.imagePlaceholder}
        mimeType={data.mimeType}
      />
    );
  }

  const onClickHandler = (e) => {
    if (onClick) onClick(data);
    e.preventDefault();
  };

  let tagsString = _.get(data, 'tags', []).join(', ');
  let tags = (
    <span><FontAwesome name="tag" /> {tagsString}</span>
  );

  let className = classnames(
    s.mediaItem,
    {
      [s.selectable]: onClick,
      [s.inline]: inline,
      [s.selected]: selected
    }
  );

  var editButton;
  if (!editDisabled) {
    editButton = (
      <IconButton
        className={s.editButton}
        to={`/project/${projectId}/media/${data.id}`}
        title="Edit"
        iconName="pencil"
      />
    );
  }

  let imageHolderClassName = classnames(s.imageHolder, props.imageHolderClassName);

  return (
    <div className={className} title={data.name}>
      <div onClick={onClickHandler}>
        <div className={imageHolderClassName}>
          {image}
        </div>
        <div className={s.metaHolder}>
          <span className={s.label}>
            {data.name}
          </span>
          <span className={s.tags} title={tagsString}>
            {tags}
          </span>
        </div>
      </div>
      { editButton }
    </div>
  );
};
MediaItem.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  inline: PropTypes.bool,
  editDisabled: PropTypes.bool,
  projectId: PropTypes.string.isRequired,
  imageHolderClassName: PropTypes.string
};


export default MediaItem;
