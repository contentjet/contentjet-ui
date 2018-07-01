import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import InviteSelectors from 'selectors/InviteSelectors';
import UserSelectors from 'selectors/UserSelectors';
import UserActions from 'actions/UserActions';
import SignUpForm from './components/SignUpForm';
import s from './SignUpIndex.css';


class SignUpIndex extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      success: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    // The screen is only accessible if an invite token exists in the store.
    if (!this.props.inviteToken) context.router.replace('/login');
  }

  onSubmit(data) {
    this.props.onSubmit(data).then(() => {
      this.setState({ success: true });
    });
  }

  render() {
    const {isSending, inviteToken} = this.props;
    if (this.state.success) {
      return (
        <div className={s.success}>
          <h2>Thank you.</h2>
          <p>A verification email has been sent to you.</p>
        </div>
      );
    }
    const err = this.props.err.toJS();
    if (!inviteToken) return null;
    return (
      <SignUpForm
        error={err}
        isSending={isSending}
        onSubmit={this.onSubmit}
        inviteToken={inviteToken}
      />
    );
  }

}

SignUpIndex.propTypes = {
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  inviteToken: PropTypes.string
};

SignUpIndex.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    err: UserSelectors.signUpError(state),
    isSending: UserSelectors.signUpIsSending(state),
    inviteToken: InviteSelectors.inviteToken(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (data) => {
      return dispatch(UserActions.signUp(data)).payload;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpIndex);
