import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import s from './DateTimePicker.css';


// See https://jquense.github.io/react-widgets/localization/
Moment.locale('en');
momentLocalizer();

class _DateTimePicker extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.props.onChange(value, this.props.name);
  }

  render() {
    const className = classnames(
      s.datetimePicker,
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
        <DateTimePicker
          {..._.omit(this.props, inputWrapperProps)}
          onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}

_DateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default _DateTimePicker;
