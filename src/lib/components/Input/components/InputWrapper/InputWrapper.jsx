import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import List from 'lib/components/List';
import classnames from 'classnames';
import s from './InputWrapper.css';


function InputWrapperLabel(props) {
  const style = {
    width: props.width
  };
  if (props.text) {
    var labelText = (
      <span
        className={classnames(s.labelText, props.labelTextClassName)}
        key={`key${props.text}`}
        style={style}
      >
        {props.text}
      </span>
    );
  }
  const className = classnames(s.label, props.className);
  if (props.asSpan) {
    return <span className={className}>{labelText}{props.children}</span>;
  }
  return <label className={className}>{labelText}{props.children}</label>;

}

InputWrapperLabel.propTypes = {
  text: PropTypes.string,
  asSpan: PropTypes.bool,
  width: PropTypes.number,
  labelTextClassName: PropTypes.string
};

const inputWrapperPropTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelTextClassName: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.array,
  helpText: PropTypes.string,
  labelAsSpan: PropTypes.bool,
  hide: PropTypes.bool,
  labelWidth: PropTypes.number
};

export const inputWrapperProps = _.keys(inputWrapperPropTypes);

class InputWrapper extends Component {

  render() {
    if (this.props.hide) return null;

    const className = classnames(
      s.inputWrapper,
      {
        [s.hasError]: _.get(this.props, 'errors.length'),
        [s.requiredField]: this.props.required
      },
      this.props.className
    );

    if (this.props.errors) {
      var errors = (
        <List className={s.errorsList}>
          {
            this.props.errors.map(error => {
              return <li key={error}>{error}</li>;
            })
          }
        </List>
      );
    }

    if (this.props.helpText) {
      var helpText = (
        <span className={s.helpText}>{this.props.helpText}</span>
      );
    }

    return (
      <div className={className}>
        <InputWrapperLabel
          className={this.props.labelClassName}
          labelTextClassName={this.props.labelTextClassName}
          text={this.props.label}
          asSpan={this.props.labelAsSpan}
          width={this.props.labelWidth}
        >
          {this.props.children}
        </InputWrapperLabel>
        {helpText}
        {errors}
      </div>
    );
  }

}

InputWrapper.propTypes = inputWrapperPropTypes;

export default InputWrapper;
