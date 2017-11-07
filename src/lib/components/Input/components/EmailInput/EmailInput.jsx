import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './EmailInput.css';


class EmailInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value, this.props.name);
  }

  render() {
    let className = classnames(
      s.emailInput,
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
          type="email"
          className={s.input}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}
EmailInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};


export default EmailInput;
