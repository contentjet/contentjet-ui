import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './TextInput.css';


class TextInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value, this.props.name);
  }

  render() {
    const className = classnames(
      s.textInput,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      this.props.className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <input
          {..._.omit(this.props, inputWrapperProps)}
          type="text"
          className={s.input}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default TextInput;
