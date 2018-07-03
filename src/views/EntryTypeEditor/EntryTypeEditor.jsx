import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EntryTypeSelectors from 'selectors/EntryTypeSelectors';
import NotificationSelectors from 'selectors/NotificationSelectors';
import _ from 'lodash';
import Immutable, { Map } from 'immutable';
import { immutableMove } from 'lib/utils/ImmutableUtils';
import EntryTypeActions from 'actions/EntryTypeActions';
import UserSelectors from 'selectors/UserSelectors';
import { Prompt } from 'react-router-dom';
import ContentHeader from 'lib/components/ContentHeader';
import Button from 'lib/components/Button';
import Input from 'lib/components/Input';
import IconButton from 'lib/components/IconButton';
import Notification from 'lib/components/Notification';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import EntryTypeFieldList from './components/EntryTypeFieldList';
import EntryTypeFieldEditorModal from './components/EntryTypeFieldEditorModal';
import ConfirmRemoveEntryTypeFieldModal from './components/ConfirmRemoveEntryTypeFieldModal';
import ConfirmDeleteEntryTypeModal from './components/ConfirmDeleteEntryTypeModal';
import s from './EntryTypeEditor.css';


class EntryTypeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entryType: this.props.entryType,
      entryTypeList: this.props.entryTypeList,
      confirmRemoveFieldModalOpen: false,
      entryTypeFieldToRemove: null,
      addFieldModalOpen: false,
      confirmDeleteModalOpen: false,
      editFieldModalOpen: false,
      fieldToEdit: null
    };
    this.getExistingFieldNames = this.getExistingFieldNames.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onConfirmRemoveField = this.onConfirmRemoveField.bind(this);
    this.onClickRemoveField = this.onClickRemoveField.bind(this);
    this.onAcceptAddField = this.onAcceptAddField.bind(this);
    this.onClickAddField = this.onClickAddField.bind(this);
    this.onClickMoveUp = this.onClickMoveUp.bind(this);
    this.onClickMoveDown = this.onClickMoveDown.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditFieldModalAccept = this.onEditFieldModalAccept.bind(this);
    this.onClickEditField = this.onClickEditField.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { match, history, userIsProjectAdmin } = this.props;
    if (!userIsProjectAdmin) {
      history.replace(`/project/${match.params.projectId}/entries`);
    }
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.listEntryTypes(match.params.project_id);
    // entry_type_id will only be present if we're editing an
    // existing entry type.
    if (match.params.entry_type_id) {
      this.props.getEntryType(
        match.params.project_id, match.params.entry_type_id
      );
    } else {
      this.props.clearEntryType();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newState = {};
    if ((nextProps.entryType !== this.props.entryType) && !nextProps.isSending) {
      newState.entryType = nextProps.entryType;
    }
    if (nextProps.entryTypeList !== this.props.entryTypeList) {
      newState.entryTypeList = nextProps.entryTypeList;
    }
    if (!_.isEmpty(newState)) this.setState(newState);
  }

  componentWillUnmount() {
    this.props.clearEntryType();
  }

  onSaveClick() {
    this.props.saveEntryType(
      this.props.match.params.project_id,
      this.state.entryType.toJS(),
      this.props.history
    );
  }

  getExistingFieldNames() {
    return this.state.entryType
      .get('fields')
      .map(field => field.get('name'))
      .toJS();
  }

  onCloseModal() {
    this.setState({
      confirmRemoveFieldModalOpen: false,
      entryTypeFieldToRemove: null,
      addFieldModalOpen: false,
      confirmDeleteModalOpen: false,
      editFieldModalOpen: false,
      fieldToEdit: false
    });
  }

  onConfirmRemoveField() {
    const fields = this.state.entryType.get('fields').filter(
      field => field !== this.state.entryTypeFieldToRemove
    );
    this.setState({
      entryType: this.state.entryType.set('fields', fields),
      confirmRemoveFieldModalOpen: false,
      entryTypeFieldToRemove: null
    });
  }

  onClickRemoveField(entryTypeField) {
    this.setState({
      confirmRemoveFieldModalOpen: true,
      entryTypeFieldToRemove: entryTypeField
    });
  }

  onAcceptAddField(fieldData) {
    const fields = this.state.entryType.get('fields').push(Immutable.fromJS(fieldData));
    this.setState({
      entryType: this.state.entryType.set('fields', fields),
      addFieldModalOpen: false
    });
  }

  onClickAddField(e) {
    e.preventDefault();
    this.setState({ addFieldModalOpen: true });
  }

  onClickMoveUp(fieldData) {
    let fields = this.state.entryType.get('fields');
    const index = fields.indexOf(fieldData);
    fields = immutableMove(fields, index, index - 1);
    this.setState({
      entryType: this.state.entryType.set('fields', fields)
    });
  }

  onClickMoveDown(fieldData) {
    let fields = this.state.entryType.get('fields');
    const index = fields.indexOf(fieldData);
    fields = immutableMove(fields, index, index + 1);
    this.setState({
      entryType: this.state.entryType.set('fields', fields)
    });
  }

  onFieldChange(value, name) {
    this.setState({
      entryType: this.state.entryType.set(name, value)
    });
  }

  onDeleteClick() {
    this.setState({ confirmDeleteModalOpen: true });
  }

  onEditFieldModalAccept(fieldData) {
    this.setState({
      entryType: this.state.entryType.update('fields', fields => {
        return fields.map(_field => {
          return _field === this.state.fieldToEdit ? _field.merge(fieldData) : _field;
        });
      }),
      editFieldModalOpen: false
    });
  }

  onClickEditField(field) {
    this.setState({
      editFieldModalOpen: true,
      fieldToEdit: field
    });
  }

  render() {
    const {
      entryType,
      confirmRemoveFieldModalOpen,
      addFieldModalOpen,
      entryTypeList,
      confirmDeleteModalOpen,
      editFieldModalOpen
    } = this.state;
    let { fieldToEdit } = this.state;

    const { isSending, isFetching, match } = this.props;
    const notification = this.props.notification.toJS();
    const err = this.props.err.toJS();

    fieldToEdit = fieldToEdit ? fieldToEdit.toJS() : null;
    const entryTypes = entryTypeList.get('results').toJS();

    // Only render delete button if we're editing an existing entry type.
    if (match.params.entry_type_id) {
      var deleteEntryTypeButton = (
        <IconButton
          className={s.deleteButton}
          icon="trash-alt"
          onClick={this.onDeleteClick}
          disabled={isSending || isFetching}
        >
          Delete
        </IconButton>
      );
    }

    if (err.message) {
      var alert = (
        <ErrorsListAlert
          className={s.alert}
          errors={[err.message]}
        />
      );
    }

    var body;
    if (isFetching) {
      body = (
        <div className={s.body}>
          <LoadingSpinner className={s.loadingSpinner} />
        </div>
      );
    } else {
      body = (
        <div className={s.body}>
          {alert}
          <div className={s.standardFields}>
            <Input
              type="text"
              name="name"
              label="Name"
              placeholder="Name"
              value={entryType.get('name', '')}
              errors={_.get(err, 'errors.name')}
              onChange={this.onFieldChange}
              required
              autoFocus
            />
            <Input
              type="text" name="description" label="Description"
              placeholder="Description"
              value={entryType.get('description', '')}
              errors={_.get(err, 'errors.description')}
              onChange={this.onFieldChange}
            />
            <Input
              inputClassName={s.metadataInput}
              type="textarea"
              label="Metadata"
              placeholder="Metadata"
              name="metadata"
              errors={_.get(err, 'errors.metadata')}
              onChange={this.onFieldChange}
              value={entryType.get('metadata', '')}
            />
          </div>
          <hr />
          <div className={s.customFields}>
            <EntryTypeFieldList
              className={s.fieldList}
              entryTypeFields={entryType.get('fields')}
              onClickDeleteField={this.onClickRemoveField}
              onClickEditField={this.onClickEditField}
              onClickMoveUp={this.onClickMoveUp}
              onClickMoveDown={this.onClickMoveDown}
            />
            <IconButton
              className={s.addFieldButton}
              icon="plus"
              onClick={this.onClickAddField}
            >
              Add field
            </IconButton>
          </div>
        </div>
      );
    }

    return (
      <div className={s.entryTypeEditor}>
        <Prompt
          when={this.state.entryType !== this.props.entryType}
          message="Your work is not saved! Are you sure you want to leave?"
        />

        <ContentHeader title="Entry type">
          { deleteEntryTypeButton }
          <Button
            btnStyle="primary"
            onClick={this.onSaveClick}
            processing={isSending}
            disabled={isSending || isFetching}
          >
            Save
          </Button>
        </ContentHeader>
        { body }
        <Notification {...notification} />
        <ConfirmRemoveEntryTypeFieldModal
          closeModal={this.onCloseModal}
          onConfirm={this.onConfirmRemoveField}
          isOpened={confirmRemoveFieldModalOpen}
        />
        <EntryTypeFieldEditorModal
          mode="CREATE"
          existingFieldNames={this.getExistingFieldNames()}
          onModalAccept={this.onAcceptAddField}
          entryTypes={entryTypes}
          closeModal={this.onCloseModal}
          isOpened={addFieldModalOpen}
        />
        <ConfirmDeleteEntryTypeModal
          projectId={match.params.project_id}
          closeModal={this.onCloseModal}
          isOpened={confirmDeleteModalOpen}
        />
        <EntryTypeFieldEditorModal
          mode="EDIT"
          existingFieldNames={this.getExistingFieldNames()}
          onModalAccept={this.onEditFieldModalAccept}
          entryTypes={entryTypes}
          closeModal={this.onCloseModal}
          initialFieldProperties={fieldToEdit}
          isOpened={editFieldModalOpen}
        />
      </div>
    );
  }

}

EntryTypeEditor.propTypes = {
  entryType: PropTypes.instanceOf(Map).isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  entryTypeList: PropTypes.instanceOf(Map).isRequired,
  listEntryTypes: PropTypes.func.isRequired,
  saveEntryType: PropTypes.func.isRequired,
  clearEntryType: PropTypes.func.isRequired,
  getEntryType: PropTypes.func.isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired,
  notification: PropTypes.instanceOf(Map).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape()
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    entryType: EntryTypeSelectors.detailData(state),
    err: EntryTypeSelectors.detailError(state),
    isSending: EntryTypeSelectors.detailIsSending(state),
    isFetching: EntryTypeSelectors.detailIsFetching(state),
    entryTypeList: EntryTypeSelectors.listData(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state),
    notification: NotificationSelectors.getNotification(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listEntryTypes: (projectId) => {
      dispatch(EntryTypeActions.list(projectId));
    },
    getEntryType: (projectId, entryTypeId) => {
      dispatch(EntryTypeActions.get(projectId, entryTypeId));
    },
    saveEntryType: (projectId, data, history) => {
      dispatch(EntryTypeActions.save(projectId, data, history));
    },
    clearEntryType: () => {
      dispatch(EntryTypeActions.clear());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryTypeEditor);
