import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import ProjectActions from 'actions/ProjectActions';
import ProjectSelectors from 'selectors/ProjectSelectors';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';


class EditMemberModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        membershipType: null,
        membershipIsActive: null
      }
    };
    this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpened && this.props.isSending && !nextProps.isSending) {
      this.props.closeModal();
    }
    if (!this.props.isOpened && nextProps.isOpened) {
      this.setState({
        formData: {
          membershipType: _.get(nextProps, 'member.membershipType'),
          membershipIsActive: _.get(nextProps, 'member.membershipIsActive')
        }
      });
    }
  }

  onInputChangeHandler(value, name) {
    const { formData } = this.state;
    value = value.value;
    if (name === 'membershipIsActive') value = value === 'active';
    formData[name] = value;
    this.setState({ formData });
  }

  onSubmit(e) {
    e.preventDefault();
    const { membershipType, membershipIsActive } = this.state.formData;
    const data = {
      userId: _.get(this.props.member, 'id'),
      membershipType,
      membershipIsActive
    };
    this.props.updateMember(this.props.projectId, data)
      .then(() => this.props.closeModal());
  }

  render() {
    const { isSending, onCancel } = this.props;
    const { formData } = this.state;

    const footer = [
      <Button
        btnStyle="link"
        key="cancel-button"
        disabled={isSending}
        onClick={onCancel}
      >
        Cancel
      </Button>,
      <Button
        btnStyle="primary"
        type="submit"
        key="ok-button"
        onClick={this.onSubmit}
        disabled={isSending}
        processing={isSending}
      >
        OK
      </Button>
    ];

    return (
      <Modal
        title="Edit member"
        onClickClose={onCancel}
        footer={footer}
        isOpened={this.props.isOpened}
      >
        <form
          onSubmit={this.onSubmit}
          noValidate
        >
          <Input
            type="select-object"
            name="membershipType"
            label="Type"
            placeholder="Type"
            value={formData.membershipType}
            choices={[
              {name: 'Admin', value: 'admin'},
              {name: 'Author', value: 'author'},
            ]}
            valueField="value"
            textField="name"
            onChange={this.onInputChangeHandler}
            autoFocus
          />
          <Input
            type="select-object"
            name="membershipIsActive"
            label="Status"
            placeholder="Status"
            value={formData.membershipIsActive ? 'active' : 'inactive'}
            choices={[
              {name: 'Active', value: 'active'},
              {name: 'Inactive', value: 'inactive'},
            ]}
            valueField="value"
            textField="name"
            onChange={this.onInputChangeHandler}
            autoFocus
          />
        </form>
      </Modal>
    );
  }

}

EditMemberModal.propTypes = {
  projectId: PropTypes.string.isRequired,
  updateMember: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isSending: PropTypes.bool.isRequired,
  isOpened: PropTypes.bool,
  member: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    isSending: ProjectSelectors.updateMemberIsSending(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMember: (projectId, data) => {
      return dispatch(ProjectActions.updateMember(projectId, data)).payload;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMemberModal);
