import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AuthenticationActions from 'actions/AuthenticationActions';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import s from './SignUp.css';


class SignUp extends Component {

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <CenteredPanelView className={s.signUp}>
        {this.props.children}
      </CenteredPanelView>
    );
  }

}
SignUp.propTypes = {
  logout: PropTypes.func.isRequired
};


const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(AuthenticationActions.logout());
    }
  };
};

export default connect(null, mapDispatchToProps)(SignUp);
