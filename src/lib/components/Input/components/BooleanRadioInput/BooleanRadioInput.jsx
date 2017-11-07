import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import List from 'lib/components/List';
import s from './BooleanRadioInput.css';


class BooleanRadioInput extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    this.props.onChange(!this.props.value, this.props.name);
  }

  render() {
    let className = classnames(
      s.booleanRadioInput,
      {
        [s.inline]: this.props.inline
      },
      this.props.className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)} className={className}
        labelAsSpan
      >
        <List inline={this.props.inline}>
          <li className={s.listItem}>
            <label className={s.listItemLabel}>
              <input
                type="radio"
                checked={this.props.value}
                onChange={this.onChange}
                value
              />
              <span className={s.listItemLabelText}>
                {this.props.labelTrue}
              </span>
            </label>
          </li>
          <li className={s.listItem}>
            <label className={s.listItemLabel}>
              <input
                type="radio"
                value={false}
                checked={!this.props.value}
                onChange={this.onChange}
              />
              <span className={s.listItemLabelText}>
                {this.props.labelFalse}
              </span>
            </label>
          </li>
        </List>
      </InputWrapper>
    );
  }

}
BooleanRadioInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  inline: PropTypes.bool,
  labelTrue: PropTypes.string,
  labelFalse: PropTypes.string
};
BooleanRadioInput.defaultProps = {
  labelTrue: 'Yes',
  labelFalse: 'No'
};



export default BooleanRadioInput;
