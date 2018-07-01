import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import s from './ToolTipBubble.css';


const ARROW_SIZE = 8;

class ToolTipBubble extends Component {

  constructor(props) {
    super(props);
    this.state = {
      style: {
        left: -2000,
        top: -2000
      }
    };
    this.calculateStyle = this.calculateStyle.bind(this);
  }

  componentDidMount() {
    this.setState({ style: this.calculateStyle() });
  }

  calculateStyle() {
    const {
      wrapperWidth, wrapperHeight, wrapperLeft, wrapperTop,
      position, xOffset, yOffset
    } = this.props;

    const rect = this._bubble.getBoundingClientRect();
    const style = {};
    // Calculate the left and top position.
    if (position === 'top' || position === 'bottom') {
      if (position === 'top') {
        style.top = wrapperTop - rect.height - ARROW_SIZE;
      } else {
        style.top = wrapperTop + wrapperHeight + ARROW_SIZE;
      }
      style.left = wrapperLeft + (wrapperWidth - rect.width) * 0.5;
    } else if (position === 'left' || position === 'right') {
      if (position === 'left') {
        style.left = wrapperLeft - rect.width - ARROW_SIZE;
      } else {
        style.left = wrapperLeft + wrapperWidth + ARROW_SIZE;
      }
      style.top = wrapperTop + (wrapperHeight - rect.height) * 0.5;
    }
    // Apply any additional offset
    style.left = style.left + xOffset;
    style.top = style.top + yOffset;
    return style;
  }

  render() {
    const { position, children } = this.props;
    let { className } = this.props;

    className = classnames(
      s.bubble,
      {
        [s.top]: position === 'top',
        [s.bottom]: position === 'bottom',
        [s.left]: position === 'left',
        [s.right]: position === 'right',
      },
      className
    );

    return (
      <div
        className={className}
        style={this.state.style}
        ref={(c) => this._bubble = c}
      >
        {children}
      </div>
    );
  }

}

ToolTipBubble.propTypes = {
  wrapperLeft: PropTypes.number.isRequired,
  wrapperTop: PropTypes.number.isRequired,
  wrapperWidth: PropTypes.number.isRequired,
  wrapperHeight: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  xOffset: PropTypes.number,
  yOffset: PropTypes.number,
};

ToolTipBubble.defaultProps = {
  position: 'top',
  xOffset: 0,
  yOffset: 0
};

export default ToolTipBubble;
