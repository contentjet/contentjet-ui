import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import Button from 'lib/components/Button';
import _ from 'lodash';
import slugify from 'underscore.string/underscored';

const TEXT = 'TEXT';
const LONGTEXT = 'LONGTEXT';
const BOOLEAN = 'BOOLEAN';
const DATE = 'DATE';
const NUMBER = 'NUMBER';
const CHOICE = 'CHOICE';
const LIST = 'LIST';
const LINK = 'LINK';
const MEDIA = 'MEDIA';
const COLOR = 'COLOR';

const COMMON_FIELDS = [
  'name',
  'label',
  'description',
  'fieldType',
  'required',
  'disabled'
];

const fieldTypeChoices = [
  { value: TEXT, name: 'Text' },
  { value: LONGTEXT, name: 'Long text' },
  { value: BOOLEAN, name: 'Boolean' },
  { value: DATE, name: 'Datetime' },
  { value: NUMBER, name: 'Number' },
  { value: CHOICE, name: 'Choice' },
  { value: LIST, name: 'List' },
  { value: LINK, name: 'Link' },
  { value: MEDIA, name: 'Media' },
  { value: COLOR, name: 'Color' }
];

const defaultFieldProperties = {
  name: '',
  label: '',
  description: '',
  fieldType: TEXT,
  format: 'plaintext',
  minLength: 0,
  maxLength: 1000,
  required: false,
  disabled: false
};

const fieldTypeConstraints = {
  [TEXT]: {
    minLength: {
      min: 0,
      max: 999
    },
    maxLength: {
      min: 1,
      max: 1000
    }
  },
  [LONGTEXT]: {
    minLength: {
      min: 0,
      max: 29999
    },
    maxLength: {
      min: 1,
      max: 30000
    }
  },
  [LIST]: {
    minLength: {
      min: 0,
      max: 999
    },
    maxLength: {
      min: 1,
      max: 1000
    }
  },
  [LINK]: {
    minLength: {
      min: 0,
      max: 999
    },
    maxLength: {
      min: 1,
      max: 1000
    }
  },
  [MEDIA]: {
    minLength: {
      min: 0,
      max: 999
    },
    maxLength: {
      min: 1,
      max: 1000
    }
  }
};

const invalidFieldNames = ['id'];

const lockMessage = (
  <div>
    <p>Changing field names is <strong>strongly discouraged</strong> as it may
    break code consuming your data via the API. Only proceed if you are
    confident you know what you are doing.</p>
    <p>Click padlock to edit.</p>
  </div>
);

function formatName(value) {
  return _.camelCase(
    slugify(
      value.replace(/[^0-9a-zA-Z]/g, '')
    )
  );
}

class EntryTypeFieldEditorModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldProperties: this.props.initialFieldProperties || defaultFieldProperties,
      nameErrors: []
    };
    this.close = this.close.bind(this);
    this.onDone = this.onDone.bind(this);
    this.isValid = this.isValid.bind(this);
    this.onFieldTypeChange = this.onFieldTypeChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onFieldNameInputBlur = this.onFieldNameInputBlur.bind(this);
    this.getNameErrors = this.getNameErrors.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let newState = {};
    if (this.props.isOpened && !nextProps.isOpened) {
      newState.page = this.props.mode === 'CREATE' ? 0 : 1;
      newState.fieldProperties = nextProps.initialFieldProperties || defaultFieldProperties;
    }
    if (nextProps.initialFieldProperties) {
      newState.fieldProperties = nextProps.initialFieldProperties;
    }
    this.setState(newState);
  }

  close() {
    this.props.closeModal(this);
  }

  onFieldTypeChange(obj, name) {
    const fieldType = obj.value;
    let fieldProperties = _.clone(this.state.fieldProperties);
    fieldProperties[name] = fieldType;
    if (_.includes([TEXT, LONGTEXT, LIST, LINK, MEDIA], fieldType)) {
      fieldProperties.minLength = fieldTypeConstraints[fieldType].minLength.min;
      fieldProperties.maxLength = fieldTypeConstraints[fieldType].maxLength.max;
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['minLength', 'maxLength']));
      if (fieldType === TEXT || fieldType === LONGTEXT) fieldProperties.format = 'markdown';
    } else if (fieldType === NUMBER) {
      fieldProperties['minValue'] = -2147483648;
      fieldProperties['maxValue'] = 2147483647;
      fieldProperties.format = 'number';
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['minValue', 'maxValue', 'format']));
    } else if (fieldType === BOOLEAN) {
      fieldProperties['labelTrue'] = 'Yes';
      fieldProperties['labelFalse'] = 'No';
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['labelTrue', 'labelFalse']));
    } else if (fieldType === CHOICE) {
      fieldProperties['choices'] = [];
      fieldProperties.format = 'single';
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['choices', 'format']));
    } else if (fieldType === DATE) {
      fieldProperties.format = 'datetime';
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['datetime', 'format']));
    } else if (fieldType === COLOR) {
      fieldProperties.format = 'rgb';
      fieldProperties = _.pick(fieldProperties, COMMON_FIELDS.concat(['format']));
    }
    this.setState({ fieldProperties });
  }

  onFieldChange(value, name) {
    // When label input changes we update the 'name' field as a slugified
    // version of label. Note we don't do this if mode == 'EDIT' because
    // changing the field name of an existing field is dangerous.
    let fieldProperties = _.clone(this.state.fieldProperties);
    fieldProperties[name] = value;
    let nameErrors = [];
    if (name === 'label' && this.props.mode !== 'EDIT') {
      fieldProperties.name = formatName(value);
      nameErrors = this.getNameErrors(fieldProperties.name);
    }
    if (name === 'minLength' && value > fieldProperties.maxLength) {
      fieldProperties.minLength = fieldProperties.maxLength;
    }
    if (name === 'minValue' && value > fieldProperties.maxValue) {
      fieldProperties.minValue = fieldProperties.maxValue;
    }
    this.setState({ fieldProperties, nameErrors });
  }

  getNameErrors(name) {
    let nameErrors = [];
    if (_.includes(this.props.existingFieldNames, name)) {
      nameErrors = ['A field with this name already exists.'];
    } else if (_.includes(invalidFieldNames, name)) {
      nameErrors = ['Invalid field name. This name is reserved.'];
    }
    return nameErrors;
  }

  onFieldNameInputBlur() {
    let fieldProperties = _.clone(this.state.fieldProperties);
    fieldProperties.name = formatName(fieldProperties.name);
    const nameErrors = this.getNameErrors(fieldProperties.name);
    this.setState({ fieldProperties, nameErrors });
  }

  onDone() {
    this.props.onModalAccept(this.state.fieldProperties);
    this.props.closeModal(this);
  }

  isValid() {
    const {fieldProperties} = this.state;
    if ('minLength' in fieldProperties && _.isNil(fieldProperties.minLength)) return false;
    if ('maxLength' in fieldProperties && _.isNil(fieldProperties.maxLength)) return false;
    if (
      'minLength' in fieldProperties && 'maxLength' in fieldProperties &&
      fieldProperties.maxLength < fieldProperties.minLength
    ) {
      return false;
    }
    if ('minValue' in fieldProperties && _.isNil(fieldProperties.minValue)) return false;
    if ('maxValue' in fieldProperties && _.isNil(fieldProperties.maxValue)) return false;
    if (
      'minValue' in fieldProperties && 'maxValue' in fieldProperties &&
      fieldProperties.maxValue < fieldProperties.minValue
    ) {
      return false;
    }
    return (
      fieldProperties.name &&
      fieldProperties.label
    );
  }

  render() {
    const {isOpened, mode} = this.props;
    if (!isOpened) return null;
    const {fieldProperties, nameErrors} = this.state;
    const {fieldType} = fieldProperties;

    const nameInputProps = {
      name: 'name',
      type: 'text',
      label: 'Field name',
      placeholder: 'Field name',
      helpText: 'The name of this field when accessed via the API',
      tabIndex: '-1',
      value: fieldProperties.name,
      errors: nameErrors,
      onChange: this.onFieldChange,
      onBlur: this.onFieldNameInputBlur,
      required: true
    };
    if (mode === 'EDIT') {
      nameInputProps.type = 'locked-text';
      nameInputProps.lockMessage = lockMessage;
    }

    let fields = [
      <Input
        type="select-object"
        name="fieldType"
        key="fieldType"
        choices={fieldTypeChoices}
        valueField="value"
        textField="name"
        label="Field type"
        placeholder="Field type"
        value={fieldProperties.fieldType}
        onChange={this.onFieldTypeChange}
        autoFocus
      />,
      <Input
        type="text"
        name="label"
        key="label"
        label="Field label"
        placeholder="Field label"
        value={fieldProperties.label}
        onChange={this.onFieldChange}
        required
        autoFocus
      />,
      <Input key="name" {...nameInputProps} />,
      <Input
        type="text"
        name="description"
        key="description"
        label="Description"
        placeholder="Description"
        helpText="A description of this field"
        value={fieldProperties.description}
        onChange={this.onFieldChange}
      />
    ];

    let dynamicFields = [];

    if (_.includes([TEXT, LONGTEXT, NUMBER, DATE, CHOICE, COLOR], fieldType)) {
      let choices;
      if (fieldType === TEXT) {
        choices = [
          'plaintext',
          'uri',
          'email'
        ];
      } else if (fieldType === LONGTEXT) {
        choices = [
          'markdown',
          'plaintext'
        ];
      } else if (fieldType === NUMBER) {
        choices = [
          'number',
          'integer'
        ];
      } else if (fieldType === DATE) {
        choices = [
          'datetime',
          'date'
        ];
      } else if (fieldType === CHOICE) {
        choices = [
          'single',
          'multiple'
        ];
      } else if (fieldType === COLOR) {
        choices = [
          'rgb',
          'rgba'
        ];
      }
      dynamicFields = dynamicFields.concat([
        <Input
          type="select"
          name="format"
          key="format"
          label="Format"
          placeholder="Format"
          choices={choices}
          value={fieldProperties.format}
          onChange={this.onFieldChange}
          required
        />
      ]);
    }

    if (_.includes([TEXT, LONGTEXT, LIST, LINK, MEDIA], fieldType)) {
      dynamicFields = dynamicFields.concat([
        <Input
          type="number"
          name="minLength"
          key="minLength"
          label="Min length"
          placeholder="Min length"
          min={fieldProperties.required ? 1 : fieldTypeConstraints[fieldType].minLength.min}
          max={fieldTypeConstraints[fieldType].minLength.max}
          value={fieldProperties.minLength}
          onChange={this.onFieldChange}
          positiveOnly
          integerOnly
          required
        />,
        <Input
          type="number"
          name="maxLength"
          key="maxLength"
          label="Max length"
          placeholder="Max length"
          min={fieldTypeConstraints[fieldType].maxLength.min}
          max={fieldTypeConstraints[fieldType].maxLength.max}
          value={fieldProperties.maxLength}
          onChange={this.onFieldChange}
          positiveOnly
          integerOnly
          required
        />
      ]);
    } else if (fieldType === NUMBER) {
      dynamicFields = dynamicFields.concat([
        <Input
          type="number"
          name="minValue"
          key="minValue"
          label="Min value"
          placeholder="Min value"
          min={-2147483648}
          max={2147483646}
          value={fieldProperties.minValue}
          onChange={this.onFieldChange}
          required
        />,
        <Input
          type="number"
          name="maxValue"
          key="maxValue"
          label="Max value"
          placeholder="Max value"
          value={fieldProperties.maxValue}
          min={-2147483647}
          max={2147483647}
          onChange={this.onFieldChange}
          required
        />
      ]);
    } else if (fieldType === BOOLEAN) {
      dynamicFields = dynamicFields.concat([
        <Input
          type="text"
          name="labelTrue"
          key="labelTrue"
          label="Label true"
          placeholder="Label true"
          value={fieldProperties.labelTrue}
          onChange={this.onFieldChange}
          required
        />,
        <Input
          type="text"
          name="labelFalse"
          key="labelFalse"
          label="Label false"
          placeholder="Label false"
          value={fieldProperties.labelFalse}
          onChange={this.onFieldChange}
          required
        />
      ]);
    } else if (fieldType === CHOICE) {
      dynamicFields = dynamicFields.concat([
        <Input
          type="array"
          name="choices"
          key="choices"
          label="Choices"
          placeholder="Choices"
          helpText="Enter one choice per line"
          value={fieldProperties.choices || []}
          onChange={this.onFieldChange}
          required
        />
      ]);
    }
    // We don't show the required checkbox for the BOOLEAN field as it's
    // not neccessary (we treat null as false);
    if (fieldType !== BOOLEAN) {
      dynamicFields.push(
        <Input
          type="checkbox"
          name="required"
          key="required"
          label="Required"
          placeholder="Required"
          value={fieldProperties.required}
          onChange={this.onFieldChange}
        />
      );
    }

    dynamicFields.push(
      <Input
        type="checkbox"
        name="disabled"
        key="disabled"
        label="Disabled"
        placeholder="Disabled"
        value={fieldProperties.disabled}
        onChange={this.onFieldChange}
      />
    );

    const footer = [
      <Button
        btnStyle="link"
        key="cancel-button"
        onClick={this.close}
      >
        Cancel
      </Button>,
      <Button
        btnStyle="primary"
        key="ok-button"
        onClick={this.onDone}
        disabled={!this.isValid()}
      >
        OK
      </Button>
    ];

    return (
      <Modal
        title={mode === 'CREATE' ? 'Add field' : 'Edit field'}
        onClickClose={this.close}
        isOpened={isOpened}
        footer={footer}
      >
        {fields}
        {dynamicFields}
      </Modal>
    );
  }

}
EntryTypeFieldEditorModal.propTypes = {
  onModalAccept: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  entryTypes: PropTypes.array.isRequired,
  existingFieldNames: PropTypes.array.isRequired,
  mode: PropTypes.oneOf(['CREATE', 'EDIT']).isRequired,
  initialFieldProperties: PropTypes.object,
  isOpened: PropTypes.bool
};


export default EntryTypeFieldEditorModal;
