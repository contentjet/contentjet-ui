import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import tinycolor from 'tinycolor2';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import { ChromePicker } from 'react-color';
import s from './ColorInput.css';


class ColorInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickCover = this.onClickCover.bind(this);
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

  onClick() {
    this.setState({ showPicker: !this.state.showPicker });
  }

  onClickCover() {
    this.setState({ showPicker: false });
  }

  render() {
    const { className, value, disableAlpha } = this.props;

    if (this.state.showPicker) {
      var picker = (
        <div className={s.popover}>
          <div className={s.cover} onClick={this.onClickCover} />
          <ChromePicker
            color={tinycolor(value || '#fff').toHsv()}
            onChangeComplete={this.onChange}
            disableAlpha={disableAlpha}
          />
        </div>
      );
    }

    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <div
          className={s.swatch}
          style={{ background: value || '#fff' }}
          onClick={this.onClick}
        />
        { picker }
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
