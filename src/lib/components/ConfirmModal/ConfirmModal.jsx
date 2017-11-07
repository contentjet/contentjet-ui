import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'lib/components/Button';
import Modal from 'lib/components/Modal';
import s from './ConfirmModal.css';


class ConfirmModal extends Component {

  render() {
    let footer = [
      <Button
        key="cancel-button"
        btnStyle="link"
        onClick={this.props.onCancel}
      >
        Cancel
      </Button>,
      <Button
        key="ok-button"
        btnStyle="primary"
        onClick={this.props.onAccept}
      >
        OK
      </Button>
    ];

    let className = classnames(s.confirmModal, this.props.className);

    return (
      <Modal
        title="Confirm"
        className={className}
        onClickClose={this.props.onCancel}
        footer={footer}
        isOpened={this.props.isOpened}
      >
        {this.props.children}
      </Modal>
    );
  }

}
ConfirmModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpened: PropTypes.bool
};


export default ConfirmModal;
