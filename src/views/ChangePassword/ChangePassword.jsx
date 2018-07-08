import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Panel from 'lib/components/Panel';
import UserActions from 'actions/UserActions';
import UserSelectors from 'selectors/UserSelectors';
import ChangePasswordForm from './components/ChangePasswordForm';


const defaultFormData = {
  password: '',
  newPassword: '',
  newPasswordConfirm: ''
};

class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: defaultFormData,
      passwordsMatch: true
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onInputChange(value, name) {
    const formData = _.clone(this.state.formData);
    formData[name] = value;
    this.setState({ formData });
  }

  onSubmit(formData) {
    if (formData.newPassword !== formData.newPasswordConfirm) {
      return this.setState({ passwordsMatch: false });
    }
    this.setState({ passwordsMatch: true }, () => {
      this.props.save(_.pick(this.state.formData, ['password', 'newPassword']));
    });
  }

  render() {
    const { err, isSending } = this.props;

    let error = err.toJS();
    if (!this.state.passwordsMatch) {
      error = {
        message: 'Your passwords must match',
        errors: {
          newPassword: ['Passwords must match'],
          newPasswordConfirm: ['Passwords must match']
        }
      };
    }

    return (
      <Panel header="Password">
        <ChangePasswordForm
          formData={this.state.formData}
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
          err={error}
          isSending={isSending}
        />
      </Panel>
    );
  }
}

ChangePassword.propTypes = {
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    err: UserSelectors.changePasswordError(state),
    isSending: UserSelectors.changePasswordIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    save: (formData) => {
      dispatch(UserActions.changePassword(formData));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
