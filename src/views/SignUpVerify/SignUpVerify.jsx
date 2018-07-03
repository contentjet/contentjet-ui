import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import UserActions from 'actions/UserActions';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Button from 'lib/components/Button';
import s from './SignUpVerify.css';


class SignUpVerify extends Component {

  componentDidMount() {
    this.props.verifyUser(this.props.match.params.token.replace(/~/g, '.'));
  }

  render() {
    const { verified } = this.props;
    const err = this.props.err.toJS();
    let content;
    if (verified) {
      content = (
        <div className={s.success}>
          <h2>Thank you.</h2>
          <p>You have successfully verified your account.</p>
          <Button
            className={s.loginButton}
            to="/login"
            btnStyle="primary"
            block
          >
            Proceed to login
          </Button>
        </div>
      );
    } else if (err.message) {
      content = (
        <ErrorsListAlert
          message="Verification failed for the following reasons:"
          errors={[err.message]}
        />
      );
    } else {
      content = (
        <h3>Verifying. Please wait.</h3>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }

}

SignUpVerify.propTypes = {
  verifyUser: PropTypes.func.isRequired,
  verified: PropTypes.bool.isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape()
  }).isRequired
};

const mapStateToProps = (state) => {
  const verification = state.getIn(['user', 'verification']);
  return {
    verified: verification.getIn(['data', 'verified']),
    err: verification.get('error')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyUser: (token) => {
      dispatch(UserActions.verifyUser(token));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpVerify);
