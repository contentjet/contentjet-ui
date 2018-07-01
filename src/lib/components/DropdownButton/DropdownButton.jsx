import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import Button from 'lib/components/Button';
import FontAwesome from 'lib/components/FontAwesome';
import s from './DropdownButton.css';


class DropdownButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.documentClickHandler = this.documentClickHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.documentClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.documentClickHandler);
  }

  documentClickHandler() {
    this.setState({ isOpen: false });
  }

  dropdownClickHandler(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  onClickHandler(e) {
    this.setState({
      isOpen: !this.state.isOpen
    });
    if (this.props.onClick) this.props.onClick(e);
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const className = classnames(
      s.dropdownButton,
      {
        [s.open]: this.state.isOpen
      },
      this.props.className
    );
    const btnProps = _.omit(this.props, ['className', 'children']);
    return (
      <div className={className}>
        <Button {...btnProps} onClick={this.onClickHandler}>
          {this.props.label}
          <FontAwesome className={s.icon} icon="caret-down" />
        </Button>
        <div
          className={s.panel}
          onClick={this.dropdownClickHandler}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

}

DropdownButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string
};

export default DropdownButton;
