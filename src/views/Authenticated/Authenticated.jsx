import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import TokenStorage from '../../services/TokenStorage';
import AuthenticationActions from 'actions/AuthenticationActions';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';
import Projects from '../Projects';
import Settings from '../Settings';
import Project from '../Project';


class Authenticated extends Component {

  constructor(props) {
    super(props);
    this.onStorage = this.onStorage.bind(this);
    window.addEventListener('storage', this.onStorage);
    if (!props.isAuthenticated) props.history.replace('/login');
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.onStorage);
  }

  onStorage() {
    // Check if we're still logged in. If not redirect to login screen. This is
    // needed in the case where the user logs out via another browser tab.
    if (!TokenStorage.hasValidToken()) this.props.logout();
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
  setRedirectPath: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: AuthenticationSelectors.isAuthenticated(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRedirectPath: (path) => dispatch(AuthenticationActions.setRedirectPath(path)),
    logout: () => dispatch(AuthenticationActions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
