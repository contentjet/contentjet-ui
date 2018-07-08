import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import s from './RequestResetPasswordForm.css';


class RequestResetPasswordForm extends Component {

  constructor(props) {
    super(props);
    this.state = { formData: {} };
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmitHandler(e) {
    e.preventDefault();
    if (this.props.isSending) return;
    this.props.onSubmit(this.state.formData);
  }

  onInputChange(value, name) {
    const { formData } = this.state;
    formData[name] = value;
    this.setState(formData);
  }

  render() {
    const { err, isSending } = this.props;
    if (err.message) {
      var formErrors = (
        <ErrorsListAlert errors={[err.message]} />
      );
    }
    return (
      <form
        className={s.requestResetPasswordForm}
        onSubmit={this.onSubmitHandler}
        noValidate
      >
        {formErrors}
        <Input
          type="email"
          label="Email"
          placeholder="Email"
          name="email"
          errors={_.get(err, 'errors.email')}
          onChange={this.onInputChange}
          autoFocus
        />
        <Button
          className={s.submitButton}
          btnStyle="primary"
          type="submit"
          onClick={this.onSubmitHandler}
          disabled={isSending}
          processing={isSending}
          block
        >
          Submit
        </Button>
      </form>
    );
  }

}
RequestResetPasswordForm.propTypes = {
  isSending: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired
};

export default RequestResetPasswordForm;
