import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import s from './ProjectSettingsForm.css';


class ProjectSettingsForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.project
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.formData);
  }

  onInputChange(value, name) {
    const { formData } = this.state;
    formData[name] = value;
    this.setState({ formData: formData });
  }

  render() {
    const { err, isSending, onClickDelete } = this.props;
    const { formData } = this.state;
    if (err.message) {
      var alert = (
        <ErrorsListAlert errors={[err.message]} />
      );
    }
    return (
      <form
        className={s.projectSettingsForm}
        onSubmit={this.onSubmit}
        noValidate
      >
        {alert}
        <Input
          type="text"
          label="Project name"
          placeholder="Project name"
          name="name"
          errors={_.get(err, 'errors.name')}
          onChange={this.onInputChange}
          value={formData.name}
          required
          autoFocus
        />
        <Input
          inputClassName={s.metadataInput}
          type="textarea"
          label="Metadata"
          placeholder="Metadata"
          name="metadata"
          errors={_.get(err, 'errors.metadata')}
          onChange={this.onInputChange}
          value={formData.metadata}
        />
        <div className={s.footer}>
          <Button
            type="button"
            btnStyle="link"
            disabled={isSending}
            onClick={onClickDelete}
          >
            Delete project
          </Button>
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
ProjectSettingsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  err: PropTypes.object.isRequired,
  isSending: PropTypes.bool.isRequired
};


export default ProjectSettingsForm;
