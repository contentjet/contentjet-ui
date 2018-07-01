import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ProjectSelectors from 'selectors/ProjectSelectors';
import NotificationSelectors from 'selectors/NotificationSelectors';
import ProjectActions from 'actions/ProjectActions';
import Panel from 'lib/components/Panel';
import Notification from 'lib/components/Notification';
import ProjectSettingsForm from './components/ProjectSettingsForm';
import GuardedConfirmModal from 'lib/components/GuardedConfirmModal';


class ProjectSettings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  onCloseModal() {
    this.setState({ modalOpen: false });
  }

  onAcceptModal() {
    this.props.delete(this.props.params.project_id);
    this.setState({ modalOpen: false });
  }

  onClickDelete() {
    this.setState({ modalOpen: true });
  }

  render() {
    const {onSubmit, isSending} = this.props;
    const err = this.props.err.toJS();
    const project = this.props.project.toJS();
    const notification = this.props.notification.toJS();
    return (
      <div>
        <Panel header="Project">
          <ProjectSettingsForm
            project={project}
            onSubmit={onSubmit}
            onClickDelete={this.onClickDelete}
            err={err}
            isSending={isSending}
          />
        </Panel>

        <Notification {...notification} />
        <GuardedConfirmModal
          closeModal={this.onCloseModal}
          onAccept={this.onAcceptModal}
          isOpened={this.state.modalOpen}
        >
          <h2>WARNING</h2>
          If you are sure you want to permanently delete this project type the word <b>DELETE</b> below.
        </GuardedConfirmModal>
      </div>
    );
  }

}

ProjectSettings.propTypes = {
  delete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  project: PropTypes.instanceOf(Map).isRequired,
  notification: PropTypes.instanceOf(Map).isRequired
};

const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    err: ProjectSelectors.detailError(state),
    isSending: ProjectSelectors.detailIsSending(state),
    notification: NotificationSelectors.getNotification(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (projectId) => {
      dispatch(ProjectActions.destroy(projectId));
    },
    onSubmit: (data) => {
      dispatch(ProjectActions.save(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectSettings);
