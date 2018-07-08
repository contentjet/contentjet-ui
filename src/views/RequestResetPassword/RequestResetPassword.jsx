import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import UserSelectors from 'selectors/UserSelectors';
import UserActions from 'actions/UserActions';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import RequestResetPasswordForm from './components/RequestResetPasswordForm';
import Button from 'lib/components/Button';


class RequestResetPassword extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      success: false
    };
  }

  onSubmit(data) {
    this.props.onSubmit(data)
      .then(() => {
        this.setState({success: true});
      });
  }

  render() {
    const { success } = this.state;
    if (success) {
      return (
        <CenteredPanelView>
          <p>A password reset link has been emailed to you.</p>
          <Button
            btnStyle="primary"
            onClick={this.onSubmitHandler}
            to="/login"
            block
          >
            Login
          </Button>
        </CenteredPanelView>
      );
    }
    const { err, isSending } = this.props;
    return (
      <CenteredPanelView>
        <RequestResetPasswordForm
          onSubmit={this.onSubmit}
          err={err.toJS()}
          isSending={isSending}
        />
      </CenteredPanelView>
    );
  }

}

RequestResetPassword.propTypes = {
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    err: UserSelectors.requestPasswordResetError(state),
    isSending: UserSelectors.requestPasswordResetIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (data) => {
      return dispatch(UserActions.requestResetPassword(data.email || '')).payload;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestResetPassword);
