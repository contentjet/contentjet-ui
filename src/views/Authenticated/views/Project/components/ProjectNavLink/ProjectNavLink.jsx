import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link, IndexLink } from 'react-router';
import FontAwesome from 'lib/components/FontAwesome';
import s from './ProjectNavLink.css';


class ProjectNavLink extends Component {

  render() {
    var L = _.get(this.props, 'indexLink') ? IndexLink : Link;
    return (
      <L
        to={this.props.path}
        className={s.link}
        activeClassName={s.active}
      >
        <FontAwesome
          name={this.props.iconName}
          className={s.icon}
        />
        <span>{this.props.label}</span>
      </L>
    );
  }

}
ProjectNavLink.propTypes = {
  path: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};


export default ProjectNavLink;
