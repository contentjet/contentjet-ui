import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProjectActions from 'actions/ProjectActions';
import ProjectSelectors from 'selectors/ProjectSelectors';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';


class CreateProjectModal extends Component {

  constructor(props) {
    super(props);
    this.state = { projectName: '' };
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputChangeHandler(value) {
    this.setState({ projectName: value });
  }

  onSubmit(e) {
    e.preventDefault();
    if (!this.state.projectName.length) return;
    this.props.save({ name: this.state.projectName });
  }

  render() {
    const { isSending, onCancel, isOpened } = this.props;

    var footer = [
      <Button
        btnStyle="link"
        key="cancel-button"
        onClick={onCancel}
      >
        Cancel
      </Button>,
      <Button
        btnStyle="primary"
        type="submit"
        key="ok-button"
        onClick={this.onSubmit}
        disabled={!this.state.projectName.length || isSending}
        processing={isSending}
      >
        OK
      </Button>
    ];

    return (
      <Modal
        title="New Project"
        onClickClose={onCancel}
        footer={footer}
        isOpened={isOpened}
      >
        <form
          onSubmit={this.onSubmit}
          noValidate
        >
          <Input
            type="text"
            name="project-name"
            label="Project name"
            value={this.state.projectName}
            helpText="eg. Acme Inc. Website"
            onChange={this.onInputChangeHandler}
            autoFocus
          />
        </form>
      </Modal>
    );
  }

}
CreateProjectModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  isOpened: PropTypes.bool
};


const mapStateToProps = (state) => {
  return {
    isSending: ProjectSelectors.detailIsSending(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    save: (data) => {
      dispatch(ProjectActions.save(data, true));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProjectModal);
