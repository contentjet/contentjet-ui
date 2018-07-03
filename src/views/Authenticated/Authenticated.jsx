import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';
import Projects from '../Projects';
import Settings from '../Settings';
import Project from '../Project';


class Authenticated extends Component {

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isAuthenticated) {
      this.props.history.replace('/login');
    }
  }

  shouldComponentUpdate() {
    return this.props.isAuthenticated;
  }

  render() {
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.path}projects`} component={Projects} />
        <Route path={`${match.path}settings`} component={Settings} />
        <Route path={`${match.path}project/:project_id`} component={Project} />
      </div>
    );
  }

}

Authenticated.propTypes = {
  isAuthenticated: PropTypes.bool,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: AuthenticationSelectors.isAuthenticated(state)
  };
};

export default connect(mapStateToProps)(Authenticated);
