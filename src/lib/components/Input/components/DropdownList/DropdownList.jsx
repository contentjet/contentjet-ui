import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import DropdownList from 'react-widgets/lib/DropdownList';


class _DropdownList extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    if (!this.props.onChange) return;
    this.props.onChange(value, this.props.name);
  }

  render() {
    let { className } = this.props;
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)} className={className}
      >
        <DropdownList
          {..._.omit(this.props, inputWrapperProps)} onChange={this.onChange}
        />
      </InputWrapper>
    );
  }

}
_DropdownList.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
};


export default _DropdownList;
