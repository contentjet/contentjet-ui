import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { Map } from 'immutable';
import UserSelectors from 'selectors/UserSelectors';
import ProjectSelectors from 'selectors/ProjectSelectors';
import List from 'lib/components/List';
import ContentHeader from 'lib/components/ContentHeader';
import s from './ProjectSettingsRoot.css';


class ProjectSettingsRoot extends Component {

  componentWillMount() {
    const {params, userIsProjectAdmin} = this.props;
    if (!userIsProjectAdmin) {
      browserHistory.replace(`/project/${params.projectId}/entries`);
    }
  }

  render() {
    const {project, children} = this.props;
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
              {children}
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
  params: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    project: ProjectSelectors.detailData(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state)
  };
};

export default connect(
  mapStateToProps
)(ProjectSettingsRoot);
