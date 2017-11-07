import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InviteSelectors from 'selectors/InviteSelectors';
import InviteActions from 'actions/InviteActions';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';


class InviteModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: ''
    };
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened && this.props.isSending && !nextProps.isSending) {
      this.props.closeModal();
    }
  }

  onInputChangeHandler(value, name) {
    this.setState({ [name]: value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.state.email.length) return;
    this.props.invite(
      this.props.projectId, _.pick(this.state, ['name', 'email'])
    );
  }

  render() {
    const { isSending } = this.props;

    let footer = [
      <Button
        btnStyle="link"
        key="cancel-button"
        disabled={isSending}
        onClick={this.props.onCancel}
      >
        Cancel
      </Button>,
      <Button
        btnStyle="primary"
        type="submit"
        key="ok-button"
        onClick={this.onSubmit}
        disabled={!this.state.name.length || !this.state.email.length || isSending}
        processing={isSending}
      >
        OK
      </Button>
    ];

    return (
      <Modal
        title="Invite"
        onClickClose={this.props.onCancel}
        footer={footer}
        isOpened={this.props.isOpened}
      >
        <form
          onSubmit={this.onSubmit}
          noValidate
        >
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="Name"
            value={this.state.name}
            onChange={this.onInputChangeHandler}
            autoFocus
          />
          <Input
            type="text"
            name="email"
            label="Email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.onInputChangeHandler}
          />
        </form>
      </Modal>
    );
  }

}
InviteModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  invite: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  isOpened: PropTypes.bool
};


const mapStateToProps = (state) => {
  return {
    isSending: InviteSelectors.detailIsSending(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    invite: (projectId, data) => {
      dispatch(InviteActions.save(projectId, data));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(InviteModal);
