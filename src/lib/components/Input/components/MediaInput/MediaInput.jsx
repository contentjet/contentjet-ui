import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { List as IList } from 'immutable';
import IconButton from 'lib/components/IconButton';
import MediaPickerModal from 'lib/components/MediaPickerModal';
import List from 'lib/components/List';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './MediaInput.css';


class MediaInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
  }

  onAcceptModal(selectedMedia) {
    this.props.onChange(selectedMedia, this.props.name);
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onClickEdit() {
    this.setState({ modalOpen: true });
  }

  render() {
    const value = this.props.value || [];
    let items;
    if (value.length) {
      items = (
        <List>
          {
            value.map(mediaItem => {
              return (
                <li key={mediaItem.id} className={s.listItem}>
                  <img
                    className={s.listItemImage}
                    src={mediaItem.thumbnail}
                  />
                </li>
              );
            })
          }
        </List>
      );
    }
    const className = classnames(s.mediaInput, this.props.className);
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelAsSpan
      >
        {items}
        <IconButton
          iconName="pencil"
          className={s.editButton}
          onClick={this.onClickEdit}
          block
        >
          Edit
        </IconButton>

        <MediaPickerModal
          maxSelections={this.props.maxLength}
          projectId={this.props.projectId}
          initialSelectedMedia={IList(this.props.value)}
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        />
      </InputWrapper>
    );
  }
}

MediaInput.propTypes = {
  value: PropTypes.array,
  name: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired
};

export default MediaInput;
