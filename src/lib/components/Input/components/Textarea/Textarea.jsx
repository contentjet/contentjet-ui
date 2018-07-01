import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import Textarea from 'react-textarea-autosize';
import s from './Textarea.css';


class _Textarea extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value, this.props.name);
  }

  render() {
    const { placeholder, value } = this.props;
    let { inputClassName, className } = this.props;
    className = classnames(
      s.textarea,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      className
    );
    inputClassName = classnames(s.input, inputClassName);
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <Textarea
          placeholder={placeholder}
          value={value || ''}
          className={inputClassName}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}
_Textarea.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  inputClassName: PropTypes.string
};
_Textarea.defaultProps = {
  minRows: 3
};


export default _Textarea;
