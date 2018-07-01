import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './Select.css';


class Select extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value, this.props.name);
  }

  render() {
    const selectChoices = this.props.choices.map((choice, i) => {
      return (
        <option
          value={choice}
          key={`choice-${i}`}
        >
          {choice}
        </option>
      );
    });
    // If value is null we prepend a null choice.
    if (!this.props.value) {
      selectChoices.unshift(
        <option value={null} key="null-choice">--- Select ---</option>
      );
    }
    const className = classnames(
      s.select,
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
        <select
          {..._.omit(this.props, inputWrapperProps, 'choices')}
          value={this.props.value || ''}
          className={s.input}
          onChange={this.onChange}
        >
          {selectChoices}
        </select>
      </InputWrapper>
    );
  }

}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  choices: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Select;
