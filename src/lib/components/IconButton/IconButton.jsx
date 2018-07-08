import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import Button from 'lib/components/Button';
import FontAwesome from 'lib/components/FontAwesome';
import s from './IconButton.css';


class IconButton extends Component {

  render() {
    const { alignIconRight } = this.props;
    const className = classnames(
      s.iconButton,
      {
        [s.right]: alignIconRight
      },
      this.props.className
    );
    const props = _.omit(this.props, ['children', 'icon', 'alignIconRight']);

    if (this.props.children) {
      var children = (
        <span className={s.text}>{this.props.children}</span>
      );
    }

    if (alignIconRight) {
      return (
        <Button {...props} className={className}>
          {children}
          <FontAwesome icon={this.props.icon} />
        </Button>
      );
    }

    return (
      <Button {...props} className={className}>
        <FontAwesome icon={this.props.icon} />
        {children}
      </Button>
    );
  }

}

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  alignIconRight: PropTypes.bool
};

export default IconButton;
