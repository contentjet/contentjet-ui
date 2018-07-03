import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import s from './SignUpForm.css';


class SignUpForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const { inviteToken } = this.props;
    this.props.onSubmit(
      Object.assign({inviteToken}, this.state.formData)
    );
  }

  onInputChange(value, name) {
    const formData = this.state.formData;
    formData[name] = value;
    this.setState({ formData: formData });
  }

  render() {
    const { error, isSending } = this.props;
    const formError = _.get(error, 'message');
    if (formError) {
      var formErrors = (
        <ErrorsListAlert
          className={s.errorsAlert}
          errors={[formError]}
        />
      );
    }
    return (
      <form
        className={s.signUpForm}
        onSubmit={this.onSubmit}
        noValidate
      >
        {formErrors}
        <Input
          type="email"
          label="Email"
          placeholder="Email"
          name="email"
          errors={_.get(error, 'errors.email')}
          onChange={this.onInputChange}
          required
          autoFocus
        />
        <Input
          type="text"
          label="Name"
          placeholder="Name"
          name="name"
          errors={_.get(error, 'errors.name')}
          onChange={this.onInputChange}
          required
        />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          errors={_.get(error, 'errors.password')}
          onChange={this.onInputChange}
          required
        />
        <Input
          type="password"
          label="Password confirm"
          placeholder="Password confirm"
          name="passwordConfirm"
          errors={_.get(error, 'errors.passwordConfirm')}
          onChange={this.onInputChange}
          required
        />
        <Button
          className={s.submitButton}
          type="submit"
          btnStyle="primary"
          disabled={isSending}
          processing={isSending}
          block
        >
          Sign up
        </Button>
      </form>
    );
  }

}
SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired,
  inviteToken: PropTypes.string.isRequired
};


export default SignUpForm;
