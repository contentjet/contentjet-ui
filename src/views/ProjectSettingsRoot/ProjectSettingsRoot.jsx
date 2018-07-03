import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Map } from 'immutable';
import UserSelectors from 'selectors/UserSelectors';
import ProjectSelectors from 'selectors/ProjectSelectors';
import List from 'lib/components/List';
import ContentHeader from 'lib/components/ContentHeader';
import ProjectSettings from '../ProjectSettings';
import ProjectMembers from '../ProjectMembers';
import WebHooks from '../WebHooks';
import API from '../API';
import s from './ProjectSettingsRoot.css';


class ProjectSettingsRoot extends Component {

  UNSAFE_componentWillMount() {
    const { match, history, userIsProjectAdmin } = this.props;
    if (!userIsProjectAdmin) {
      history.replace(`/project/${match.params.projectId}/entries`);
    }
  }

  render() {
    const { project, match } = this.props;
    const projectId = project.get('id');

    return (
      <div className={s.projectSettingsRoot}>
        <ContentHeader title={project.get('name')} />
        <div className={s.body}>
          <div className={s.content}>
            <div className={s.sidebar}>
              <nav>
                <List>
                  <li>
                    <NavLink
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/project`}
                    >
                      Project
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/members`}
                    >
                      Members
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/web-hooks`}
                    >
                      Web Hooks
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/api`}
                    >
                      API
                    </NavLink>
                  </li>
                </List>
              </nav>
            </div>
            <div className={s.contentBody}>
              <Route path={`${match.path}project`} component={ProjectSettings} />
              <Route path={`${match.path}members`} component={ProjectMembers} />
              <Route path={`${match.path}web-hooks`} component={WebHooks} />
              <Route path={`${match.path}api`} component={API} />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ProjectSettingsRoot.propTypes = {
  project: PropTypes.instanceOf(Map).isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state)
  };
};

export default connect(mapStateToProps)(ProjectSettingsRoot);
