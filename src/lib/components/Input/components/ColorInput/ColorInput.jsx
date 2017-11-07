import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import { ChromePicker } from 'react-color';


class ColorInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(color) {
    if (!color) return;
    let value;
    if (this.props.disableAlpha) {
      value = color.hex;
    } else {
      value = tinycolor(color.hsv).toHex8String();
    }
    this.props.onChange(value, this.props.name);
  }

  render() {
    const {className, value, disableAlpha} = this.props;
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <ChromePicker
          color={tinycolor(value || '#fff').toHsv()}
          onChangeComplete={this.onChange}
          disableAlpha={disableAlpha}
        />
      </InputWrapper>
    );
  }

}
ColorInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
  disableAlpha: PropTypes.bool
};
ColorInput.defaultProps = {
  disableAlpha: true
};


export default ColorInput;
