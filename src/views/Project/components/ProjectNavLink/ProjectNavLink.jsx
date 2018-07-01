import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FontAwesome from 'lib/components/FontAwesome';
import s from './ProjectNavLink.css';


class ProjectNavLink extends Component {

  render() {
    return (
      <Link
        to={this.props.path}
        className={s.link}
        activeClassName={s.active}
      >
        <FontAwesome
          icon={this.props.icon}
          className={s.icon}
        />
        <span>{this.props.label}</span>
      </Link>
    );
  }

}

ProjectNavLink.propTypes = {
  path: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default ProjectNavLink;
