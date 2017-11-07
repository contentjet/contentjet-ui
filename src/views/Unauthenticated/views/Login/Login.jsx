import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';
import AuthenticationActions from 'actions/AuthenticationActions';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import LoginForm from './components/LoginForm';
import s from './Login.css';


class Login extends Component {

  componentWillReceiveProps(nextProps) {
    // If we're already authenticated we navigate away.
    if (nextProps.isAuthenticated) {
      this.context.router.replace('/projects');
    }
  }

  render() {
    const {isSending, login} = this.props;
    const err = this.props.err.toJS();
    return (
      <CenteredPanelView className={s.login}>
        <LoginForm
          error={err}
          isSending={isSending}
          onSubmit={login}
        />
      </CenteredPanelView>
    );
  }

}
Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isSending: PropTypes.bool.isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  login: PropTypes.func.isRequired
};
Login.contextTypes = {
  router: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
  return {
    isAuthenticated: AuthenticationSelectors.isAuthenticated(state),
    isSending: AuthenticationSelectors.isSending(state),
    err: AuthenticationSelectors.error(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => {
      dispatch(AuthenticationActions.login(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
