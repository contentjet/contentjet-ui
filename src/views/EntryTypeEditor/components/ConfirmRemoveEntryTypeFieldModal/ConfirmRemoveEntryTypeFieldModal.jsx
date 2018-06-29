import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GuardedConfirmModal from 'lib/components/GuardedConfirmModal';


class ConfirmRemoveEntryTypeFieldModal extends Component {

  render() {
    return (
      <GuardedConfirmModal
        onAccept={this.props.onConfirm}
        closeModal={this.props.closeModal}
        isOpened={this.props.isOpened}
      >
        <h2>WARNING</h2>
        Removing a field will permanently delete any values stored in the
        field across all existing entries.
        If you are sure you want to proceed, type the word <b>DELETE</b> below.
        <em>(Note the field will not be deleted until you save the entry type).</em>
      </GuardedConfirmModal>
    );
  }

}
ConfirmRemoveEntryTypeFieldModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isOpened: PropTypes.bool
};


export default ConfirmRemoveEntryTypeFieldModal;
