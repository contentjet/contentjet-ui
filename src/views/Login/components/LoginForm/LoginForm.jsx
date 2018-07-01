import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import { Link } from 'react-router-dom';
import s from './LoginForm.css';


class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = { formData: {} };
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.formData);
  }

  onInputChange(value, name) {
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({ formData: formData });
  }

  render() {
    const {error} = this.props;
    if (error.message) {
      var alert = (
        <ErrorsListAlert
          className={s.alert}
          errors={[error.message]}
        />
      );
    }
    return (
      <form
        className={s.loginForm}
        onSubmit={this.onSubmit}
        noValidate
      >
        {alert}
        <Input
          type="email"
          label="Email"
          placeholder="Email"
          name="username"
          onChange={this.onInputChange}
          errors={_.get(error, 'errors.username')}
          required
          autoFocus
        />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          onChange={this.onInputChange}
          errors={_.get(error, 'errors.password')}
          required
        />
        <Button
          className={s.submitButton}
          type="submit"
          btnStyle="primary"
          disabled={this.props.isSending}
          processing={this.props.isSending}
          block
        >
          Login
        </Button>
        <Link
          className={s.forgotPassword}
          to="/reset-password"
        >
          Forgot password?
        </Link>
      </form>
    );
  }

}
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired
};

export default LoginForm;
