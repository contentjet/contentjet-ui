import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Route, Redirect } from 'react-router-dom';
import ProjectSelectors from 'selectors/ProjectSelectors';
import UserSelectors from 'selectors/UserSelectors';
import ProjectActions from 'actions/ProjectActions';
import UserActions from 'actions/UserActions';
import AuthenticationActions from 'actions/AuthenticationActions';
import ProjectNav from './components/ProjectNav';
import AppHeader from 'lib/components/AppHeader';
import ProjectSettingsRoot from '../ProjectSettingsRoot';
import EntryTypes from '../EntryTypes';
import EntryTypeEditor from '../EntryTypeEditor';
import Entries from '../Entries';
import EntryEditor from '../EntryEditor';
import Media from '../Media';
import MediaEditor from '../MediaEditor';
import s from './Project.css';


class Project extends Component {

  componentDidMount() {
    this.props.getProject(this.props.match.params.project_id);
    this.props.getMe();
  }

  render() {
    const {
      project,
      userIsProjectAdmin,
      me,
      logout,
      match
    } = this.props;

    // NOTE: We don't render child routes until the project and authenticated
    // user is loaded.
    const projectId = project.get('id');
    const meId = me.get('id');
    let content;
    if (projectId && meId) {
      content = (
        <div className={s.content}>
          <Route exact path={match.path} render={() => <Redirect to={`/project/${match.params.project_id}/entries`} />} />
          <Route path={`${match.path}/settings`} component={ProjectSettingsRoot} />
          <Route exact path={`${match.path}/entry-types`} component={EntryTypes} />
          <Route path={`${match.path}/entry-types/edit/:entry_type_id?`} component={EntryTypeEditor} />
          <Route exact path={`${match.path}/entries`} component={Entries} />
          <Route path={`${match.path}/entries/:entry_type_id/:entry_id?`} component={EntryEditor} />
          <Route exact path={`${match.path}/media`} component={Media} />
          <Route path={`${match.path}/media/:media_id`} component={MediaEditor} />
        </div>
      );
    }

    return (
      <div className={s.project}>
        <div className={s.header}>
          <AppHeader
            onClickLogout={logout}
            userName={me.get('name', '')}
          />
        </div>
        <div className={s.sidebar}>
          <ProjectNav
            projectId={match.params.project_id}
            userIsProjectAdmin={userIsProjectAdmin}
          />
        </div>
        { content }
      </div>
    );
  }
}

Project.propTypes = {
  getProject: PropTypes.func.isRequired,
  getMe: PropTypes.func.isRequired,
  project: PropTypes.instanceOf(Map).isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired,
  me: PropTypes.instanceOf(Map).isRequired,
  logout: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape()
  }).isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(Project);
