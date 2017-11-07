import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import Button from 'lib/components/Button';
import FontAwesome from 'lib/components/FontAwesome';
import s from './IconButton.css';


class IconButton extends Component {

  render() {
    let { alignIconRight } = this.props;
    let className = classnames(
      s.iconButton,
      {
        [s.right]: alignIconRight
      },
      this.props.className
    );
    let props = _.omit(this.props, ['children', 'iconName', 'alignIconRight']);

    if (this.props.children) {
      var children = (
        <span className={s.text}>{this.props.children}</span>
      );
    }

    if (alignIconRight) {
      return (
        <Button {...props} className={className}>
          {children}
          <FontAwesome name={this.props.iconName} />
        </Button>
      );
    }

    return (
      <Button {...props} className={className}>
        <FontAwesome name={this.props.iconName} />
        {children}
      </Button>
    );
  }

}
IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  alignIconRight: PropTypes.bool
};


export default IconButton;
