import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthenticationActions from 'actions/AuthenticationActions';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import SignUpIndex from '../SignUpIndex';
import SignUpVerify from '../SignUpVerify';
import s from './SignUp.css';


class SignUp extends Component {

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <CenteredPanelView className={s.signUp}>
        <Route exact path={this.props.match.path} component={SignUpIndex} />
        <Route path={`${this.props.match.path}verify/:token`} component={SignUpVerify} />
      </CenteredPanelView>
    );
  }

}

SignUp.propTypes = {
  logout: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(AuthenticationActions.logout());
    }
  };
};

export default connect(null, mapDispatchToProps)(SignUp);
