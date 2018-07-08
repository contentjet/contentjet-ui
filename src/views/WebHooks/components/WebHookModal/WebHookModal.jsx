import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import WebHookSelectors from 'selectors/WebHookSelectors';
import WebHookActions from 'actions/WebHookActions';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Button from 'lib/components/Button';
import s from './WebHookModal.css';


const defaultState = {
  name: '',
  url: '',
  projectUpdated: true,
  projectDeleted: true,
  entryTypeCreated: true,
  entryTypeUpdated: true,
  entryTypeDeleted: true,
  entryCreated: true,
  entryUpdated: true,
  entryDeleted: true,
  entryDeletedBulk: true,
  mediaCreated: true,
  mediaUpdated: true,
  mediaDeleted: true,
  mediaDeletedBulk: true,
  isActive: true
};

class WebHookModal extends Component {

  constructor(props) {
    super(props);
    if (this.props.webHook) {
      this.state = _.cloneDeep(this.props.webHook);
    } else {
      this.state = defaultState;
    }
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.webHook) {
      this.setState(_.cloneDeep(nextProps.webHook));
    }
    if (this.props.isOpened && this.props.isSending && !nextProps.isSending) {
      this.props.closeModal();
    }
  }

  onInputChangeHandler(value, name) {
    const obj = {};
    obj[name] = value;
    this.setState(obj);
  }

  canSubmit() {
    return (
      this.state.name.length &&
      this.state.url.length &&
      !this.props.webHookDetail.get('isSending')
    );
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.canSubmit()) return;
    this.props.saveWebHook(
      this.props.projectId, this.state
    );
  }

  render() {
    const { isSending, closeModal, isOpened } = this.props;
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
        className={s.webHookModal}
        title="New Web Hook"
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
            helpText="A descriptive name for this web hook eg. Mobile app"
            onChange={this.onInputChangeHandler}
            errors={_.get(err, 'errors.name')}
            required
            autoFocus
          />
          <Input
            type="text"
            name="url"
            label="URL"
            value={this.state.url}
            helpText="The URL we will POST events to"
            onChange={this.onInputChangeHandler}
            errors={_.get(err, 'errors.url')}
            required
          />

          <hr className={s.hr} />

          <div className={s.events}>
            <Input
              type="checkbox"
              name="projectUpdated"
              value={this.state.projectUpdated}
              label="Project updated"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="projectDeleted"
              value={this.state.projectDeleted}
              label="Project deleted"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryTypeCreated"
              value={this.state.entryTypeCreated}
              label="Entry type created"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryTypeUpdated"
              value={this.state.entryTypeUpdated}
              label="Entry type updated"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryTypeDeleted"
              value={this.state.entryTypeDeleted}
              label="Entry type deleted"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryCreated"
              value={this.state.entryCreated}
              label="Entry created"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryUpdated"
              value={this.state.entryUpdated}
              label="Entry updated"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryDeleted"
              value={this.state.entryDeleted}
              label="Entry deleted"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="entryDeletedBulk"
              value={this.state.entryDeletedBulk}
              label="Entry deleted bulk"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="mediaCreated"
              value={this.state.mediaCreated}
              label="Media created"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="mediaUpdated"
              value={this.state.mediaUpdated}
              label="Media updated"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="mediaDeleted"
              value={this.state.mediaDeleted}
              label="Media deleted"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
            <Input
              type="checkbox"
              name="mediaDeletedBulk"
              value={this.state.mediaDeletedBulk}
              label="Media deleted bulk"
              onChange={this.onInputChangeHandler}
              labelWidth={140}
            />
          </div>

          <hr className={s.hr} />

          <Input
            type="checkbox"
            name="isActive"
            value={this.state.isActive}
            label="Is active"
            onChange={this.onInputChangeHandler}
            labelWidth={140}
          />

        </form>
      </Modal>
    );
  }

}

WebHookModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  saveWebHook: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  webHookDetail: PropTypes.instanceOf(Map).isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  webHook: PropTypes.object,
  isOpened: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    webHookDetail: WebHookSelectors.detailData(state),
    err: WebHookSelectors.detailError(state),
    isSending: WebHookSelectors.detailIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveWebHook: (projectId, data) => {
      dispatch(WebHookActions.save(projectId, data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WebHookModal);
