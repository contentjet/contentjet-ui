import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ClientSelectors from 'selectors/ClientSelectors';
import ClientActions from 'actions/ClientActions';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Button from 'lib/components/Button';


class ClientModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.client) {
      this.setState(_.cloneDeep(nextProps.client));
    }
    if (this.props.isOpened && this.props.isSending && !nextProps.isSending) {
      this.props.closeModal();
    }
  }

  onInputChangeHandler(value, name) {
    let obj = {};
    obj[name] = value;
    this.setState(obj);
  }

  canSubmit() {
    return (
      this.state.name.length && !this.props.isSending
    );
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.canSubmit()) return;
    this.props.saveClient(
      this.props.projectId, this.state
    );
  }

  render() {
    const {isSending, closeModal, isOpened} = this.props;
    const err = this.props.err.toJS();

    const footer = [
      <Button
        btnStyle="link"
        key="cancel-button"
        onClick={closeModal}
        disabled={isSending}
      >
        Cancel
      </Button>,
      <Button
        btnStyle="primary"
        type="submit"
        key="ok-button"
        onClick={this.onSubmit}
        disabled={!this.canSubmit()}
        processing={isSending}
      >
        OK
      </Button>
    ];

    if (err.message) {
      var errorList = (
        <ErrorsListAlert errors={[err.message]} />
      );
    }

    return (
      <Modal
        title="New Client"
        onClickClose={closeModal}
        footer={footer}
        isOpened={isOpened}
      >
        { errorList }
        <form noValidate onSubmit={this.onSubmit}>
          <Input
            type="text"
            name="name"
            label="Name"
            value={this.state.name}
            helpText="A descriptive name for this client eg. Mobile app"
            onChange={this.onInputChangeHandler}
            errors={_.get(err, 'errors.name')}
            required
            autoFocus
          />
        </form>
      </Modal>
    );
  }

}

ClientModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  saveClient: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  clientDetail: PropTypes.instanceOf(Map).isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  client: PropTypes.object,
  isOpened: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    clientDetail: ClientSelectors.detailData(state),
    err: ClientSelectors.detailError(state),
    isSending: ClientSelectors.detailIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveClient: (projectId, data) => {
      dispatch(ClientActions.save(projectId, data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientModal);
