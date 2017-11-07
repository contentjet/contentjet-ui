import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import s from './CheckboxListItem.css';
import IconButton from 'lib/components/IconButton';


class CheckboxListItem extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClickUp = this.onClickUp.bind(this);
    this.onClickDown = this.onClickDown.bind(this);
  }

  onChange() {
    this.props.onChange(!this.props.checked);
  }

  onClickUp(e) {
    e.stopPropagation();
    this.props.onClickUp();
  }

  onClickDown(e) {
    e.stopPropagation();
    this.props.onClickDown();
  }

  render() {
    const className = classnames(
      s.checkboxListItem,
      {
        [s.moveable]: this.props.onClickUp || this.props.onClickDown
      },
      this.props.className
    );
    const elementProps = _.omit(
      this.props,
      [
        'children', 'checked', 'className', 'onChange', 'onClickUp', 'onClickDown',
        'upButtonDisabled', 'downButtonDisabled'
      ]
    );

    var arrowButtons;
    if (this.props.onClickUp || this.props.onClickDown) {
      arrowButtons = (
        <div className={s.column}>
          <IconButton
            className={s.arrowButton}
            iconName="arrow-up"
            btnStyle="link"
            onClick={this.onClickUp}
            disabled={this.props.upButtonDisabled}
          />
          <IconButton
            className={s.arrowButton}
            iconName="arrow-down"
            btnStyle="link"
            onClick={this.onClickDown}
            disabled={this.props.downButtonDisabled}
          />
        </div>
      );
    }

    return (
      <li className={className} onClick={this.onChange} {...elementProps}>
        <div className={s.column}>
          <input
            className={s.input}
            type="checkbox"
            checked={this.props.checked}
            onChange={this.onChange}
          />
        </div>
        <div className={s.column}>
          { this.props.children }
        </div>
        { arrowButtons }
      </li>
    );
  }

}
CheckboxListItem.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  onClickUp: PropTypes.func,
  onClickDown: PropTypes.func,
  upButtonDisabled: PropTypes.bool,
  downButtonDisabled: PropTypes.bool
};


export default CheckboxListItem;
