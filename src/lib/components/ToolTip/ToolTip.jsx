import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import ToolTipBubble from './components/ToolTipBubble';
import s from './ToolTip.css';


class ToolTip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseIsOver: false,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.onWindowScroll = this.onWindowScroll.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onWindowScroll, true);
    // We append a new empty div just before the closing <body> tag.
    this._bubbleRoot = document.createElement('div');
    document.body.appendChild(this._bubbleRoot);
    // Force an initial render of the bubble.
    this.onWindowScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll, true);
    ReactDOM.unmountComponentAtNode(this._bubbleRoot);
    this._bubbleRoot.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled) {
      this.setState({ mouseIsOver: false }, this.renderBubble);
    }
  }

  onWindowScroll() {
    const rect = this._wrapper.getBoundingClientRect();
    this.setState(
      {
        mouseIsOver: false,
        top: rect.top,
        right: rect.right,
        left: rect.left,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      },
      this.renderBubble
    );
  }

  renderBubble() {
    if (this.state.mouseIsOver) {
      ReactDOM.render(
        <ToolTipBubble
          wrapperTop={this.state.top}
          wrapperLeft={this.state.left}
          wrapperWidth={this.state.width}
          wrapperHeight={this.state.height}
          position={this.props.position}
          xOffset={this.props.xOffset}
          yOffset={this.props.yOffset}
        >
          {this.props.content}
        </ToolTipBubble>,
        this._bubbleRoot
      );
    } else {
      ReactDOM.unmountComponentAtNode(this._bubbleRoot);
    }
  }

  onMouseEnter() {
    if (this.props.disabled) return;
    this.setState({ mouseIsOver: true }, this.renderBubble);
  }

  onMouseLeave() {
    this.setState({ mouseIsOver: false }, this.renderBubble);
  }

  render() {
    const { children } = this.props;
    let { className } = this.props;
    className = classnames(s.wrapper, className);
    return (
      <div
        className={className}
        ref={(c) => this._wrapper = c}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {children}
      </div>
    );
  }
}
ToolTip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  xOffset: PropTypes.number,
  yOffset: PropTypes.number,
  disabled: PropTypes.bool
};
ToolTip.defaultProps = {
  position: 'top',
  xOffset: 0,
  yOffset: 0
};



export default ToolTip;
