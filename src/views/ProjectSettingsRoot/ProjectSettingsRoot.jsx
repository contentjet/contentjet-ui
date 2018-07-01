import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

  componentWillMount() {
    const { params, userIsProjectAdmin } = this.props;
    if (!userIsProjectAdmin) {
      // FIXME
      // browserHistory.replace(`/project/${params.projectId}/entries`);
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
                    <Link
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/project`}
                    >
                      Project
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/members`}
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/web-hooks`}
                    >
                      Web Hooks
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={s.link}
                      activeClassName={s.linkActive}
                      to={`/project/${projectId}/settings/api`}
                    >
                      API
                    </Link>
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
  params: PropTypes.object.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state)
  };
};

export default connect(mapStateToProps)(ProjectSettingsRoot);
