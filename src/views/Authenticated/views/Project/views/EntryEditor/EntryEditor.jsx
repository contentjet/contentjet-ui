import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EntrySelectors from 'selectors/EntrySelectors';
import EntryTypeSelectors from 'selectors/EntryTypeSelectors';
import NotificationSelectors from 'selectors/NotificationSelectors';
import EntryTagSelectors from 'selectors/EntryTagSelectors';
import { Map, List } from 'immutable';
import _ from 'lodash';
import slugify from 'underscore.string/slugify';
import moment from 'moment';
import EntryActions from 'actions/EntryActions';
import EntryTagActions from 'actions/EntryTagActions';
import EntryTypeActions from 'actions/EntryTypeActions';
import ContentHeader from '../components/ContentHeader';
import Button from 'lib/components/Button';
import IconButton from 'lib/components/IconButton';
import Input from 'lib/components/Input';
import ConfirmModal from 'lib/components/ConfirmModal';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Notification from 'lib/components/Notification';
import s from './EntryEditor.css';


class EntryEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entry: this.props.entry,
      entryType: this.props.entryType,
      entryTags: this.props.entryTags
    };
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onSaveCopyClick = this.onSaveCopyClick.bind(this);
    this.onAcceptModal = this.onAcceptModal.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onCreateTag = this.onCreateTag.bind(this);
    this.onCustomFieldChange = this.onCustomFieldChange.bind(this);
    this.onSingleChoiceFieldChange = this.onSingleChoiceFieldChange.bind(this);
  }

  routerWillLeave() {
    if (this.state.entry !== this.props.entry) {
      return 'Your work is not saved! Are you sure you want to leave?';
    }
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};
    if (nextProps.entry !== this.props.entry) {
      newState.entry = nextProps.entry;
    }
    if (nextProps.entryType !== this.props.entryType) {
      newState.entryType = nextProps.entryType;
    }
    if (nextProps.entryTags !== this.props.entryTags) {
      newState.entryTags = nextProps.entryTags;
    }
    if (!_.isEmpty(newState)) this.setState(newState);
  }

  componentWillUnmount() {
    // We always clear the active entry from the store.
    this.props.clearActiveEntry();
  }

  componentDidMount() {
    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    this.props.getEntryType(
      this.props.params.project_id,
      this.props.params.entry_type_id
    );
    this.props.listEntryTags(this.props.params.project_id);
    // If entry_id is present in params we want to edit an existing entry.
    if (this.props.params.entry_id) {
      this.props.getEntry(
        this.props.params.project_id,
        this.props.params.entry_id
      );
    }
  }

  onSaveClick() {
    let data = _.merge(
      this.state.entry.toJS(),
      { entryTypeId: this.state.entryType.get('id') }
    );
    this.props.saveEntry(this.props.params.project_id, data);
  }

  onSaveCopyClick() {
    let data = _.merge(
      this.state.entry.toJS(),
      { entryTypeId: this.state.entryType.get('id') }
    );
    delete data.id;
    this.props.saveEntry(this.props.params.project_id, data);
  }

  onAcceptModal() {
    this.props.deleteEntry(
      this.props.params.project_id,
      this.state.entry.toJS()
    );
    this.setState({ modalOpen: false });
  }

  onCancelModal() {
    this.setState({ modalOpen: false });
  }

  onDeleteClick() {
    this.setState({ modalOpen: true });
  }

  onFieldChange(value, name) {
    if (name === 'tags') value = List(value);
    this.setState({
      entry: this.state.entry.set(name, value)
    });
  }

  onCreateTag(name) {
    let newTag = slugify(name);
    let tags = this.state.entry.get('tags');
    if (!tags.contains(newTag)) {
      tags = tags.push(newTag);
      this.setState({
        entry: this.state.entry.set('tags', tags)
      });
    }
  }

  onCustomFieldChange(value, name) {
    this.setState({
      entry: this.state.entry.setIn(['fields', name], value)
    });
  }

  onSingleChoiceFieldChange(value, name) {
    this.onCustomFieldChange([value], name);
  }

  render() {
    const { isSending } = this.props;
    const err = this.props.err.toJS();
    const notification = this.props.notification.toJS();

    let entryType = this.state.entryType.toJS();
    let entry = this.state.entry.toJS();
    let entryTags = this.state.entryTags.toJS();

    var fields = [];
    if (entryType) {
      fields = entryType.fields
        .filter(entryTypeField => !entryTypeField.disabled)
        .map(entryTypeField => {
          var fieldProps = {
            className: s.field,
            label: entryTypeField.label,
            helpText: entryTypeField.description,
            placeholder: entryTypeField.label,
            name: entryTypeField.name,
            required: entryTypeField.required,
            value: _.get(entry.fields, entryTypeField.name, null),
            errors: _.get(err, `errors.fields.${entryTypeField.name}`),
            onChange: this.onCustomFieldChange
          };
          if (entryTypeField.fieldType === 'TEXT') {
            fieldProps.type = 'text';
            fieldProps.value = fieldProps.value || '';
          } else if (entryTypeField.fieldType === 'COLOR') {
            fieldProps.type = 'color';
            if (entryTypeField.format === 'rgba') {
              fieldProps.disableAlpha = false;
            }
          } else if (entryTypeField.fieldType === 'LONGTEXT') {
            if (entryTypeField.format === 'markdown') {
              fieldProps.type = 'markdown';
            } else {
              fieldProps.type = 'textarea';
            }
            fieldProps.projectId = this.props.params.project_id;
          } else if (entryTypeField.fieldType === 'LIST') {
            fieldProps.type = 'array';
          } else if (entryTypeField.fieldType === 'BOOLEAN') {
            fieldProps.value = !!fieldProps.value;
            fieldProps.type = 'boolean';
            fieldProps.inline = true;
            fieldProps.labelTrue = entryTypeField.labelTrue;
            fieldProps.labelFalse = entryTypeField.labelFalse;
          } else if (entryTypeField.fieldType === 'NUMBER') {
            fieldProps.type = 'number';
            fieldProps.min = entryTypeField.minValue;
            fieldProps.max = entryTypeField.maxValue;
            if (entryTypeField.format === 'integer') fieldProps.integerOnly = true;
          } else if (entryTypeField.fieldType === 'MEDIA') {
            fieldProps.type = 'media';
            fieldProps.maxLength = entryTypeField.maxLength;
            fieldProps.projectId = this.props.params.project_id;
          } else if (entryTypeField.fieldType === 'DATE') {
            if (entryTypeField.format === 'date') fieldProps.time = false;
            fieldProps.type = 'datetime';
            if (fieldProps.value === '') {
              fieldProps.value = null;
            } else if (_.isString(fieldProps.value)) {
              fieldProps.value = moment(fieldProps.value).toDate();
            }
          } else if (entryTypeField.fieldType === 'CHOICE') {
            if (entryTypeField.format === 'single') {
              fieldProps.type = 'select';
              fieldProps.value = _.get(fieldProps.value, '0');
              fieldProps.choices = entryTypeField.choices;
              // Note this gets it's own change handler because we need to convert
              // the value from a string to a single item array
              fieldProps.onChange = this.onSingleChoiceFieldChange;
            } else if (entryTypeField.format === 'multiple') {
              fieldProps.type = 'select-list';
              fieldProps.data = entryTypeField.choices;
              fieldProps.multiple = true;
            } else {
              throw Error('Invalid CHOICE field format');
            }
          } else if (entryTypeField.fieldType === 'LINK') {
            fieldProps.type = 'entry-input';
            fieldProps.value = fieldProps.value || [];
            fieldProps.excludeEntries = [_.get(entry, 'id')];
            fieldProps.projectId = this.props.params.project_id;
            fieldProps.maxLength = entryTypeField.maxLength;
          }
          return <Input key={entryTypeField.name} {...fieldProps} />;
        });
    }

    // Only render delete and copy buttons if we're editing an existing entry.
    if (this.props.params.entry_id) {
      var saveCopyButton = (
        <Button
          className={s.saveCopyButton}
          onClick={this.onSaveCopyClick}
          disabled={isSending}
        >
          Save copy
        </Button>
      );
      var deleteEntryButton = (
        <IconButton
          iconName="trash-o"
          className={s.deleteEntryButton}
          onClick={this.onDeleteClick}
          disabled={isSending}
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

    return (
      <div className={s.entryEditor}>
        <ContentHeader title={_.get(entryType, 'name')}>
          { deleteEntryButton }
          { saveCopyButton }
          <Button
            btnStyle="primary"
            onClick={this.onSaveClick}
            processing={isSending}
            disabled={isSending}
          >
            Save
          </Button>
        </ContentHeader>

        <div className={s.body}>
          <div className={s.content}>
            {alert}
            <form
              className={s.form}
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <div className={s.standardFields}>
                <Input
                  name="name"
                  label="Name"
                  placeholder="Name"
                  type="text"
                  errors={_.get(err, 'errors.name')}
                  value={entry.name}
                  onChange={this.onFieldChange}
                  required
                  autoFocus
                />
                <Input
                  name="tags"
                  label="Tags"
                  placeholder="Tags"
                  type="multi-select"
                  errors={_.get(err, 'errors.tags')}
                  value={entry.tags}
                  data={entryTags}
                  onChange={this.onFieldChange}
                  onCreate={this.onCreateTag}
                />
                <Input
                  name="published"
                  label="Published"
                  placeholder="Published"
                  type="datetime"
                  errors={_.get(err, 'errors.published')}
                  value={moment(entry.published).toDate()}
                  onChange={this.onFieldChange}
                  required
                />
              </div>
              <hr />
              <div className={s.customFields}>
                {fields}
              </div>
            </form>

          </div>
        </div>

        <Notification {...notification} />
        <ConfirmModal
          onAccept={this.onAcceptModal}
          onCancel={this.onCancelModal}
          isOpened={this.state.modalOpen}
        >
          Are you sure you want to permanently delete this entry?
        </ConfirmModal>
      </div>
    );
  }

}
EntryEditor.propTypes = {
  entry: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  entryTags: PropTypes.instanceOf(List).isRequired,
  entryType: PropTypes.instanceOf(Map).isRequired,
  notification: PropTypes.instanceOf(Map).isRequired,
  listEntryTags: PropTypes.func.isRequired,
  getEntryType: PropTypes.func.isRequired,
  getEntry: PropTypes.func.isRequired,
  saveEntry: PropTypes.func.isRequired,
  clearActiveEntry: PropTypes.func.isRequired,
  deleteEntry: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
EntryEditor.contextTypes = {
  router: PropTypes.object.isRequired
};


const mapStateToProps = (state) => {
  return {
    entry: EntrySelectors.detailData(state),
    isSending: EntrySelectors.detailIsSending(state),
    err: EntrySelectors.detailError(state),
    entryTags: EntryTagSelectors.listData(state),
    entryType: EntryTypeSelectors.detailData(state),
    notification: NotificationSelectors.getNotification(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listEntryTags: (projectId) => {
      dispatch(EntryTagActions.list(projectId));
    },
    getEntryType: (projectId, entryTypeId) => {
      dispatch(EntryTypeActions.get(projectId, entryTypeId));
    },
    getEntry: (projectId, entryId) => {
      dispatch(EntryActions.get(projectId, entryId));
    },
    saveEntry: (projectId, data) => {
      dispatch(EntryActions.save(projectId, data));
    },
    clearActiveEntry: () => {
      dispatch(EntryActions.clearActiveEntry());
    },
    deleteEntry: (projectId, data) => {
      dispatch(EntryActions.destroy(projectId, data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryEditor);
