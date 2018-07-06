import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import ProjectSelectors from 'selectors/ProjectSelectors';
import InviteSelectors from 'selectors/InviteSelectors';
import ProjectActions from 'actions/ProjectActions';
import InviteActions from 'actions/InviteActions';
import UserTable from './components/UserTable';
import InviteTable from './components/InviteTable';
import InviteModal from './components/InviteModal';
import EditMemberModal from './components/EditMemberModal';
import Panel from 'lib/components/Panel';
import Button from 'lib/components/Button';
import IconButton from 'lib/components/IconButton';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import ConfirmModal from 'lib/components/ConfirmModal';
import s from './ProjectMembers.css';


class ProjectMembers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inviteModalOpen: false,
      deleteInvitesModalOpen: false,
      editMemberModalOpen: false,
      selectedInvites: [],
      memberToEdit: null
    };
    this.closeModals = this.closeModals.bind(this);
    this.closeEditMemberModal = this.closeEditMemberModal.bind(this);
    this.onInviteClick = this.onInviteClick.bind(this);
    this.toggleInviteSelect = this.toggleInviteSelect.bind(this);
    this.onDeleteSelectedClick = this.onDeleteSelectedClick.bind(this);
    this.onConfirmDeleteSelected = this.onConfirmDeleteSelected.bind(this);
    this.onClickEditUser = this.onClickEditUser.bind(this);
  }

  componentDidMount() {
    this.props.listInvites();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.invites !== nextProps.invites) {
      this.setState({ selectedInvites: [] });
    }
  }

  closeModals() {
    this.setState({
      inviteModalOpen: false,
      deleteInvitesModalOpen: false,
      editMemberModalOpen: false
    });
  }

  closeEditMemberModal() {
    this.closeModals();
    this.props.getProject(this.props.match.params.project_id);
  }

  onInviteClick() {
    this.setState({ inviteModalOpen: true });
  }

  toggleInviteSelect(invite) {
    const selectedInviteIds = this.state.selectedInvites.map(invite => invite.id);
    let selectedInvites;
    if (selectedInviteIds.includes(invite.id)) {
      selectedInvites = this.state.selectedInvites.filter(_invite => _invite.id !== invite.id);
    } else {
      selectedInvites = this.state.selectedInvites;
      selectedInvites.push(invite);
    }
    this.setState({ selectedInvites });
  }

  onDeleteSelectedClick() {
    this.setState({ deleteInvitesModalOpen: true });
  }

  onConfirmDeleteSelected() {
    const inviteIds = this.state.selectedInvites.map(invite => invite.id);
    this.props.bulkDestroy(inviteIds);
    this.setState({ deleteInvitesModalOpen: false });
  }

  onClickEditUser(user) {
    this.setState({
      editMemberModalOpen: true,
      memberToEdit: user
    });
  }

  render() {
    const { invitesIsFetching, match } = this.props;
    const { memberToEdit } = this.state;
    const project = this.props.project.toJS();
    const invites = this.props.invites.toJS();
    const {
      selectedInvites,
      deleteInvitesModalOpen,
      inviteModalOpen,
      editMemberModalOpen
    } = this.state;

    const invitesPanelFooter = (
      <div>
        <Button
          className={s.deleteSelectedInvitesButton}
          btnStyle="link"
          disabled={!selectedInvites.length}
          onClick={this.onDeleteSelectedClick}
        >
          Delete selected
        </Button>
        <Button
          btnStyle="primary"
          onClick={this.onInviteClick}
        >
          Invite
        </Button>
      </div>
    );

    var invitesBody;
    if (invitesIsFetching) {
      invitesBody = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else {
      invitesBody = (
        <InviteTable
          invites={invites}
          selectedInvites={selectedInvites}
          toggleSelect={this.toggleInviteSelect}
        />
      );
    }

    return (
      <div>
        <Panel header="Members">
          <UserTable
            users={_.orderBy(project.members, 'name')}
            onClickEditUser={this.onClickEditUser}
          />
        </Panel>
        <Panel
          header="Pending invites"
          footer={invitesPanelFooter}
          footerTextAlign="right"
        >
          { invitesBody }
        </Panel>

        <InviteModal
          projectId={match.params.project_id}
          onCancel={this.closeModals}
          closeModal={this.closeModals}
          isOpened={inviteModalOpen}
        />
        <EditMemberModal
          projectId={match.params.project_id}
          onCancel={this.closeModals}
          closeModal={this.closeEditMemberModal}
          isOpened={editMemberModalOpen}
          member={memberToEdit}
        />
        <ConfirmModal
          isOpened={deleteInvitesModalOpen}
          onAccept={this.onConfirmDeleteSelected}
          onCancel={this.closeModals}
        >
          <span>
            Are you sure you want to <strong>permanently</strong> delete
            the {selectedInvites.length} selected invites?
          </span>
        </ConfirmModal>
      </div>
    );
  }

}

ProjectMembers.propTypes = {
  project: PropTypes.instanceOf(Map).isRequired,
  invites: PropTypes.instanceOf(List).isRequired,
  invitesIsFetching: PropTypes.bool.isRequired,
  listInvites: PropTypes.func.isRequired,
  bulkDestroy: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape()
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    invites: InviteSelectors.listData(state),
    invitesIsFetching: InviteSelectors.listIsFetching(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { project_id } = props.match.params;
  return {
    listInvites: () => {
      dispatch(InviteActions.list(project_id));
    },
    bulkDestroy: (inviteIds) => {
      dispatch(InviteActions.bulkDestroy(project_id, inviteIds));
    },
    getProject: (projectId) => {
      dispatch(ProjectActions.get(projectId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMembers);
