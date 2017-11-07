import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import UserSelectors from 'selectors/UserSelectors';
import UserActions from 'actions/UserActions';
import { Map } from 'immutable';
import Button from 'lib/components/Button';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import ChangePasswordForm from './components/ChangePasswordForm';


class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      success: false
    };
  }

  onSubmit(data) {
    const token = this.props.params.token.replace(/~/g, '.');
    this.props.onSubmit(token, data)
      .then(() => {
        this.setState({success: true});
      });
  }

  render() {
    const { success } = this.state;
    if (success) {
      return (
        <CenteredPanelView>
          <p>Your password has been changed. You may now proceed to login.</p>
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
        <ChangePasswordForm
          onSubmit={this.onSubmit}
          err={err.toJS()}
          isSending={isSending}
        />
      </CenteredPanelView>
    );
  }

}
ChangePassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired
};


const mapStateToProps = (state) => {
  return {
    err: UserSelectors.changePasswordError(state),
    isSending: UserSelectors.changePasswordIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (token, data) => {
      return dispatch(UserActions.changePassword(token, data.password)).payload;
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
