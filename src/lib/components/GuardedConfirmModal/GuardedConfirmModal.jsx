import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from 'lib/components/Button';
import Modal from 'lib/components/Modal';
import Alert from 'lib/components/Alert';
import Input from 'lib/components/Input';
import s from './GuardedConfirmModal.css';


class GuardedConfirmModal extends Component {

  constructor(props) {
    super(props);
    this.state = { confirm: '' };
    this.onDecline = this.onDecline.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onDecline() {
    this.props.closeModal();
    if (this.props.onDecline) this.props.onDecline();
  }

  onInputChange(value) {
    this.setState({ confirm: _.trim(value).toLowerCase() });
  }

  render() {
    let footer = [
      <Button
        key="cancel-button"
        btnStyle="link"
        onClick={this.onDecline}
      >
        Cancel
      </Button>,
      <Button
        key="ok-button"
        btnStyle="primary"
        onClick={this.props.onAccept}
        disabled={this.state.confirm !== 'delete'}
      >
        OK
      </Button>
    ];

    return (
      <Modal
        title="Confirm"
        onClickClose={this.props.closeModal}
        footer={footer}
        isOpened={this.props.isOpened}
      >
        <Alert className={s.alert} danger>
          {this.props.children}
        </Alert>
        <Input
          type="text"
          label="Confirm"
          name="confirm"
          onChange={this.onInputChange}
          autoFocus
        />
      </Modal>
    );
  }

}
GuardedConfirmModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  isOpened: PropTypes.bool
};


export default GuardedConfirmModal;
