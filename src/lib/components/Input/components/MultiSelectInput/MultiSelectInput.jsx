import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import Multiselect from 'react-widgets/lib/Multiselect';
import s from './MultiSelectInput.css';


class MultiSelectInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.props.onChange(value, this.props.name);
  }

  render() {
    let className = classnames(s.multiSelectInput, this.props.className);
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
        labelAsSpan
      >
        <Multiselect
          {..._.omit(this.props, inputWrapperProps)}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}
MultiSelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};


export default MultiSelectInput;
