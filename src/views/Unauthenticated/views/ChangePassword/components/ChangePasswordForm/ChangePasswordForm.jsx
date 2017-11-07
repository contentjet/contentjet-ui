import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import s from './ChangePasswordForm.css';


class ChangePasswordForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        password: '',
        passwordConfirm: ''
      }
    };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmitHandler(e) {
    e.preventDefault();
    if (this.props.isSending) return;
    this.props.onSubmit(_.omit(this.state.formData, 'passwordConfirm'));
  }

  onInputChange(value, name) {
    let formData = this.state.formData;
    formData[name] = value;
    this.setState(formData);
  }

  render() {
    const {err, isSending} = this.props;
    const {password, passwordConfirm} = this.state.formData;
    if (err.message) {
      var formErrors = (
        <ErrorsListAlert errors={[err.message]} />
      );
    }
    if (password && passwordConfirm && password !== passwordConfirm) {
      var passwordsDontMatch = true;
    }
    return (
      <form
        className={s.changePasswordForm}
        onSubmit={this.onSubmitHandler}
        noValidate
      >
        {formErrors}
        <Input
          type="password"
          label="New password"
          placeholder="New password"
          name="password"
          errors={_.get(err, 'errors.password')}
          value={password}
          onChange={this.onInputChange}
          required
          autoFocus
        />
        <Input
          type="password"
          label="New password confirm"
          placeholder="New password confirm"
          name="passwordConfirm"
          errors={passwordsDontMatch ? ['Must match password'] : null}
          value={passwordConfirm}
          onChange={this.onInputChange}
          required
        />
        <Button
          className={s.submitButton}
          btnStyle="primary"
          type="submit"
          onClick={this.onSubmitHandler}
          disabled={isSending || passwordsDontMatch}
          block
        >
          Submit
        </Button>
      </form>
    );
  }

}
ChangePasswordForm.propTypes = {
  isSending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired
};


export default ChangePasswordForm;
