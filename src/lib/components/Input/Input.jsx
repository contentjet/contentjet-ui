import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BooleanRadioInput from './components/BooleanRadioInput';
import DateTimePicker from './components/DateTimePicker';
import Select from './components/Select';
import SelectObject from './components/SelectObject';
import TextInput from './components/TextInput';
import EmailInput from './components/EmailInput';
import PasswordInput from './components/PasswordInput';
import MarkdownInput from './components/MarkdownInput';
import Textarea from './components/Textarea';
import NumberPicker from './components/NumberPicker';
import MediaInput from './components/MediaInput';
import SelectListInput from './components/SelectListInput';
import MultiSelectInput from './components/MultiSelectInput';
import EntryInput from './components/EntryInput';
import SearchInput from './components/SearchInput';
import CheckboxInput from './components/CheckboxInput';
import LockedTextInput from './components/LockedTextInput';
import ColorInput from './components/ColorInput';
import ListInput from './components/ListInput';


class Input extends Component {

  render() {
    let type = this.props.type;
    if (type === 'text') {
      return <TextInput {...this.props} />;
    } else if (type === 'select') {
      return <Select {...this.props} />;
    } else if (type === 'select-object') {
      return <SelectObject {...this.props} />;
    } else if (type === 'password') {
      return <PasswordInput {...this.props} />;
    } else if (type === 'search') {
      return <SearchInput {...this.props} />;
    } else if (type === 'email') {
      return <EmailInput {...this.props} />;
    } else if (type === 'textarea') {
      return <Textarea {...this.props} />;
    } else if (type === 'markdown') {
      return <MarkdownInput {...this.props} />;
    } else if (type === 'boolean') {
      return <BooleanRadioInput {...this.props} />;
    } else if (type === 'number') {
      return <NumberPicker {...this.props} />;
    } else if (type === 'datetime') {
      return <DateTimePicker {...this.props} />;
    } else if (type === 'media') {
      return <MediaInput {...this.props} />;
    } else if (type === 'select-list') {
      return <SelectListInput {...this.props} />;
    } else if (type === 'multi-select') {
      return <MultiSelectInput {...this.props} />;
    } else if (type === 'entry-input') {
      return <EntryInput {...this.props} />;
    } else if (type === 'checkbox') {
      return <CheckboxInput {...this.props} />;
    } else if (type === 'locked-text') {
      return <LockedTextInput {...this.props} />;
    } else if (type === 'color') {
      return <ColorInput {...this.props} />;
    } else if (type === 'list') {
      return <ListInput {...this.props} />;
    }
  }

}
Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  errors: PropTypes.array,
  helpText: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'select',
    'select-object',
    'password',
    'textarea',
    'markdown',
    'boolean',
    'number',
    'datetime',
    'media',
    'select-list',
    'multi-select',
    'entry-input',
    'email',
    'search',
    'checkbox',
    'locked-text',
    'color',
    'list'
  ]).isRequired,
  choices: PropTypes.array
};


export default Input;
