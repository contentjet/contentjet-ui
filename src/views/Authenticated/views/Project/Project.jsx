import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ProjectSelectors from 'selectors/ProjectSelectors';
import UserSelectors from 'selectors/UserSelectors';
import ProjectActions from 'actions/ProjectActions';
import UserActions from 'actions/UserActions';
import AuthenticationActions from 'actions/AuthenticationActions';
import ProjectNav from './components/ProjectNav';
import AppHeader from 'lib/components/AppHeader';
import s from './Project.css';


class Project extends Component {

  componentDidMount() {
    this.props.getProject(this.props.params.project_id);
    this.props.getMe();
  }

  render() {
    let {
      params,
      project,
      userIsProjectAdmin,
      me,
      logout,
      children
    } = this.props;
    // NOTE: We don't render children until the project and authenticated
    // user is loaded.
    const projectId = project.get('id');
    const meId = me.get('id');
    children = (
      (projectId && meId) ? children : null
    );

    return (
      <div className={s.project}>
        <AppHeader
          onClickLogout={logout}
          userName={me.get('name', '')}
        />
        <div className={s.sidebar}>
          <ProjectNav
            projectId={params.project_id}
            userIsProjectAdmin={userIsProjectAdmin}
          />
        </div>
        <div className={s.content}>
          {children}
        </div>
      </div>
    );
  }
}
Project.propTypes = {
  params: PropTypes.object.isRequired,
  getProject: PropTypes.func.isRequired,
  getMe: PropTypes.func.isRequired,
  project: PropTypes.instanceOf(Map).isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired,
  me: PropTypes.instanceOf(Map).isRequired,
  logout: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    me: UserSelectors.me(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    getMe: () => {
      dispatch(UserActions.getMe());
    },
    getProject: (projectId) => {
      dispatch(ProjectActions.get(projectId));
    },
    logout: () => {
      dispatch(AuthenticationActions.logout());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Project);
