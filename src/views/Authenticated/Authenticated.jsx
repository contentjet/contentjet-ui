import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AuthenticationActions from 'actions/AuthenticationActions';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';
import Projects from '../Projects';
import Settings from '../Settings';
import Project from '../Project';


class Authenticated extends Component {

  constructor(props) {
    super(props);
    if (!props.isAuthenticated) props.history.replace('/login');
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isAuthenticated) {
      this.props.setRedirectPath(this.props.location.pathname);
      this.props.history.replace('/login');
    }
  }

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.path}projects`} component={Projects} />
        <Route path={`${match.path}settings`} component={Settings} />
        <Route path={`${match.path}project/:project_id`} component={Project} />
      </Switch>
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
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  setRedirectPath: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: AuthenticationSelectors.isAuthenticated(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRedirectPath: (path) => dispatch(AuthenticationActions.setRedirectPath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
