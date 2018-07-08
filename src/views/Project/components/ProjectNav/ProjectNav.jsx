import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProjectNavLink from '../ProjectNavLink';
import List from 'lib/components/List';
import s from './ProjectNav.css';


class ProjectNav extends Component {

  render() {
    let projectSettings;
    let entryTypes;
    if (this.props.userIsProjectAdmin) {
      projectSettings = (
        <li>
          <ProjectNavLink
            icon="cog"
            path={`/project/${this.props.projectId}/settings`}
            label="Project Settings"
          />
        </li>
      );
      entryTypes = (
        <li>
          <ProjectNavLink
            icon="database"
            path={`/project/${this.props.projectId}/entry-types`}
            label="Entry Types"
          />
        </li>
      );
    }

    return (
      <nav className={s.projectNav}>
        <List>
          <li>
            <ProjectNavLink
              icon="file-alt"
              path={`/project/${this.props.projectId}/entries`}
              label="Entries"
            />
          </li>
          <li>
            <ProjectNavLink
              icon="file-image"
              path={`/project/${this.props.projectId}/media`}
              label="Media"
            />
          </li>
          { entryTypes }
          { projectSettings }
        </List>
      </nav>
    );
  }

}

ProjectNav.propTypes = {
  projectId: PropTypes.string.isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired
};

export default ProjectNav;
