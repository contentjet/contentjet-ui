import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import s from './ArrayInput.css';


class ArrayInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    let value = e.target.value.split('\n');
    this.props.onChange(value, this.props.name);
  }

  onBlur(e) {
    let value = e.target.value
      .split('\n')
      .map(line => {
        return _.trim(line);
      })
      .filter(line => {
        return line !== '';
      });
    this.props.onChange(value, this.props.name);
  }

  render() {
    let value = _.values(this.props.value).join('\n');
    let className = classnames(
      s.arrayInput,
      {
        [s.hasError]: _.get(this.props, 'errors.length')
      },
      this.props.className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)} className={className}
      >
        <Textarea
          {..._.omit(this.props, inputWrapperProps)}
          className={s.textarea}
          value={value}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      </InputWrapper>
    );
  }

}
ArrayInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.string)
};
ArrayInput.defaultProps = {
  minRows: 3
};

export default ArrayInput;
