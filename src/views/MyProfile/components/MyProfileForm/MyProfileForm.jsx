import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import s from './MyProfileForm.css';


class MyProfileForm extends Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.props.formData);
  }

  render() {
    const { err, onInputChange, isSending, formData } = this.props;
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
        className={s.myProfileForm}
        onSubmit={this.onSubmit}
        noValidate
      >
        {alert}
        <Input
          type="text"
          label="Name"
          placeholder="Name"
          name="name"
          errors={_.get(err, 'errors.name')}
          onChange={onInputChange}
          value={formData.name}
          required
          autoFocus
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
MyProfileForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
  err: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired
};


export default MyProfileForm;
