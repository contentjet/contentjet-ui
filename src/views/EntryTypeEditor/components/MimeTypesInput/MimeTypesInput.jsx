import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';


const mediaMimeTypeChoices = [
  { value: '', name: 'Any type' },
  { value: 'images', name: 'Images only (GIF, JPEG, PNG)' }
];


const mimeTypes = ['image/gif', 'image/jpeg', 'image/png'];


class MimeTypesInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value, name) {
    this.props.onChange(value.value === 'images' ? mimeTypes : [], name);
  }

  render() {
    const props = _.omit(this.props, ['type', 'onChange', 'value']);
    let value;
    // FIXME: This is a very crude check.
    if (_.includes(this.props.value, 'image/gif')) {
      value = mediaMimeTypeChoices[1];
    } else {
      value = mediaMimeTypeChoices[0];
    }

    return (
      <Input
        type="select-object"
        choices={mediaMimeTypeChoices}
        valueField="value"
        textField="name"
        onChange={this.onChange}
        value={value}
        {...props}
      />
    );
  }

}
MimeTypesInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired
};


export default MimeTypesInput;
