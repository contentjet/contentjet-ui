import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import simpleNumberLocalizer from 'react-widgets-simple-number';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import s from './NumberPicker.css';


// See https://jquense.github.io/react-widgets/localization/
simpleNumberLocalizer();

class _NumberPicker extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value, name) {
    if (value) {
      if (this.props.positiveOnly) value = Math.abs(value);
      if (this.props.integerOnly) value = parseInt(value);
    }
    this.props.onChange(value, name);
  }

  render() {
    const { name } = this.props;
    let { className } = this.props;
    className = classnames(
      s.numberPicker,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <NumberPicker
          format="-#.#"
          {..._.omit(this.props, inputWrapperProps)}
          className={s.input}
          onChange={value => this.onChange(value, name)}
        />
      </InputWrapper>
    );
  }

}

_NumberPicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  integerOnly: PropTypes.bool,
  positiveOnly: PropTypes.bool
};

export default _NumberPicker;
