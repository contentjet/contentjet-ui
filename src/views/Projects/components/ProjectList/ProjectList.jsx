import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import List from 'lib/components/List';
import FontAwesome from 'lib/components/FontAwesome';
import s from './ProjectList.css';


const ProjectList = (props) => {
  const { projects } = props;
  let { className } = props;
  className = classnames(s.projectList, className);
  return (
    <List className={className}>
      {
        projects.map(project => {
          return (
            <li className={s.item} key={project.id}>
              <Link to={`/project/${project.id}/entries`}>
                <FontAwesome
                  className={s.itemIcon}
                  icon="chevron-right"
                />
                {project.name}
              </Link>
            </li>
          );
        })
      }
    </List>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.array.isRequired
};

export default ProjectList;
