import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import InputWrapper, { inputWrapperProps } from '../InputWrapper';
import FontAwesome from 'lib/components/FontAwesome';
import ToolTip from 'lib/components/ToolTip';
import s from './LockedTextInput.css';


class LockedTextInput extends Component {

  constructor(props) {
    super(props);
    this.state = { locked: true };
    this.onChange = this.onChange.bind(this);
    this.onClickLock = this.onClickLock.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.value, this.props.name);
  }

  onClickLock() {
    this.setState({ locked: false }, () => {
      this._input.focus();
    });
  }

  render() {
    let className = classnames(
      s.lockedTextInput,
      {
        [s.hasError]: _.get(this.props, 'errors.length'),
        [s.locked]: this.state.locked
      },
      this.props.className
    );
    return (
      <InputWrapper
        {..._.pick(this.props, inputWrapperProps)}
        className={className}
      >
        <ToolTip
          content={this.props.lockMessage}
          disabled={!this.state.locked}
          block
        >
          <FontAwesome
            className={s.icon}
            name={this.state.locked ? 'lock' : 'unlock-alt'}
            onClick={this.onClickLock}
          />
          <input
            {..._.omit(this.props, inputWrapperProps, 'lockMessage')}
            type="text"
            ref={(c) => { this._input = c; }}
            className={s.input}
            onChange={this.onChange}
            disabled={this.state.locked}
            onBlur={() => { this.setState({ locked: true }); }}
          />
        </ToolTip>
      </InputWrapper>
    );
  }

}
LockedTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  lockMessage: PropTypes.node.isRequired
};


export default LockedTextInput;
