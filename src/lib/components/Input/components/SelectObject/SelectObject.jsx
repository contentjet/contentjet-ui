import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './SelectObject.css';


class SelectObject extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const value = _.find(this.props.choices, (choice) => {
      // As e.target.value will always be a string we need to cast here.
      return String(choice[this.props.valueField]) === e.target.value;
    });
    this.props.onChange(value, this.props.name);
  }

  render() {
    const { choices, valueField, textField } = this.props;
    let { value } = this.props;
    const selectChoices = choices.map((choice, i) => {
      return (
        <option
          value={choice[valueField]}
          key={`choice-${i}`}
        >
          {choice[textField]}
        </option>
      );
    });
    // If value is null we prepend a null choice.
    if (!value) {
      selectChoices.unshift(
        <option value={null} key="null-choice">--- Select ---</option>
      );
    }
    const className = classnames(
      s.selectObject,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      this.props.className
    );

    value = _.isObject(value) ? value[valueField] : value;

    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <select
          {..._.omit(this.props, inputWrapperProps, 'choices', 'textField', 'valueField')}
          value={value || ''}
          className={s.input}
          onChange={this.onChange}
        >
          {selectChoices}
        </select>
      </InputWrapper>
    );
  }

}

SelectObject.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  valueField: PropTypes.string.isRequired,
  textField: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  choices: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default SelectObject;
