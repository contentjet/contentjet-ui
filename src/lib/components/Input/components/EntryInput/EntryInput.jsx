import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { List as IList } from 'immutable';
import { Link } from 'react-router';
import IconButton from 'lib/components/IconButton';
import List from 'lib/components/List';
import EntryPickerModal from 'lib/components/EntryPickerModal';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './EntryInput.css';


class EntryInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  onAcceptModal(value) {
    this.props.onChange(value, this.props.name);
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onClickEdit() {
    this.setState({ modalOpen: true });
  }

  onRemoveClick(entry) {
    const value = _.without(this.props.value, entry);
    this.props.onChange(value, this.props.name);
  }

  render() {
    const { value=[], projectId } = this.props;

    let items;
    if (value.length) {
      items = (
        <List className={s.list}>
          {
            value.map(entry => {
              return (
                <li key={entry.id} className={s.listItem}>
                  <Link
                    to={`/project/${projectId}/entries/${entry.entryTypeId}/${entry.id}`}
                    target="_blank"
                  >
                    {entry.name}
                  </Link>
                </li>
              );
            })
          }
        </List>
      );
    }

    const className = classnames(s.entryInput, this.props.className);
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelAsSpan
      >
        {items}
        <IconButton
          className={s.editButton}
          iconName="pencil"
          onClick={this.onClickEdit}
          block
        >
          Edit
        </IconButton>

        <EntryPickerModal
          projectId={this.props.projectId}
          excludedEntryIds={this.props.excludeEntries}
          initialSelectedEntries={IList(this.props.value)}
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        />
      </InputWrapper>
    );
  }

}

EntryInput.propTypes = {
  value: PropTypes.array,
  excludeEntries: PropTypes.array,
  name: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired
};

export default EntryInput;
