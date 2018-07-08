import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import EntryTypeSelectors from 'selectors/EntryTypeSelectors';
import EntryTypeActions from 'actions/EntryTypeActions';
import GuardedConfirmModal from 'lib/components/GuardedConfirmModal';
import Modal from 'lib/components/Modal';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Button from 'lib/components/Button';


class ConfirmDeleteEntryTypeModal extends Component {

  constructor(props) {
    super(props);
    this.onAccept = this.onAccept.bind(this);
  }

  onAccept() {
    this.props.deleteEntryType(
      this.props.projectId,
      this.props.entryTypeId,
      this.props.history
    );
  }

  render() {
    const { closeModal, isOpened } = this.props;
    const err = this.props.err.toJS();
    if (err.message) {
      const footer = (
        <Button
          btnStyle="primary"
          onClick={closeModal}
        >
          OK
        </Button>
      );
      return (
        <Modal
          title="Error"
          onClickClose={closeModal}
          isOpened={isOpened}
          footer={footer}
        >
          <ErrorsListAlert errors={[err.message]} />
        </Modal>
      );
    }

    return (
      <GuardedConfirmModal
        onAccept={this.onAccept}
        closeModal={closeModal}
        isOpened={isOpened}
      >
        <h2>WARNING</h2>
        Deleting an entry type will delete <strong>all entries</strong> matching
        this type. If you are sure you want to proceed, type the
        word <b>DELETE</b> below.
      </GuardedConfirmModal>
    );
  }

}

ConfirmDeleteEntryTypeModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteEntryType: PropTypes.func.isRequired,
  entryTypeId: PropTypes.number,
  projectId: PropTypes.string.isRequired,
  isOpened: PropTypes.bool,
  err: PropTypes.instanceOf(Map).isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    entryTypeId: EntryTypeSelectors.detailData(state).get('id'),
    err: EntryTypeSelectors.detailError(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteEntryType: (projectId, entryTypeId, history) => {
      dispatch(EntryTypeActions.destroy(projectId, entryTypeId, history));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDeleteEntryTypeModal);
