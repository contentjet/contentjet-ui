import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './CheckboxInput.css';


class CheckboxInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.checked, this.props.name);
  }

  render() {
    const className = classnames(s.checkboxInput, this.props.className);
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelTextClassName={s.labelText}
      >
        <input
          {..._.omit(this.props, inputWrapperProps)}
          type="checkbox"
          className={s.input}
          checked={this.props.value}
          onChange={this.onChange}
          value
        />
      </InputWrapper>
    );
  }

}

CheckboxInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func
};

export default CheckboxInput;
