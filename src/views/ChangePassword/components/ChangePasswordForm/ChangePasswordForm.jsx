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
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.props.formData);
  }

  render() {
    let { err, onInputChange, isSending, formData } = this.props;
    if (err.message) {
      var alert = (
        <ErrorsListAlert
          className={s.alert}
          errors={[err.message]}
        />
      );
    }
    return (
      <form
        className={s.changePasswordForm}
        onSubmit={this.onSubmit}
        noValidate
      >
        {alert}
        <Input
          type="password"
          label="Current password"
          placeholder="Current password"
          name="password"
          errors={_.get(err, 'errors.password')}
          onChange={onInputChange}
          value={formData.password}
          required
          autoFocus
        />
        <Input
          type="password"
          label="New password"
          placeholder="New password"
          name="newPassword"
          errors={_.get(err, 'errors.newPassword')}
          onChange={onInputChange}
          value={formData.newPassword}
          required
        />
        <Input
          type="password"
          label="Confirm new password"
          placeholder="Confirm new password"
          name="newPasswordConfirm"
          onChange={onInputChange}
          value={formData.newPasswordConfirm}
          errors={_.get(err, 'errors.newPasswordConfirm')}
          required
        />
        <div className={s.footer}>
          <Button
            type="submit"
            btnStyle="primary"
            disabled={isSending}
            processing={isSending}
          >
            Save
          </Button>
        </div>
      </form>
    );
  }

}
ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired
};


export default ChangePasswordForm;
