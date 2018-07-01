import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import SelectList from 'react-widgets/lib/SelectList';
import s from './SelectListInput.css';


class SelectListInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.props.onChange(value, this.props.name);
  }

  render() {
    const className = classnames(
      s.selectListInput,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      this.props.className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelAsSpan
      >
        <SelectList
          {..._.omit(this.props, inputWrapperProps)}
          className={s.input}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}

SelectListInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default SelectListInput;
