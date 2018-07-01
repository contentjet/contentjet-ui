import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Motion, spring } from 'react-motion';
import IconButton from 'lib/components/IconButton';
import Portal from 'react-portal';
import s from './Modal.css';


class Modal extends Component {

  render() {
    let { className, bodyClassName } = this.props;
    const { wide, isOpened } = this.props;

    if (!isOpened) return null;

    className = classnames(
      s.modal,
      {
        [s.wide]: wide
      },
      className
    );

    bodyClassName = classnames(
      s.body,
      bodyClassName
    );

    if (this.props.footer) {
      var modalFooter = (
        <div className={s.footer}>{this.props.footer}</div>
      );
    }

    return (
      <Portal isOpened={isOpened}>
        <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(1)}}>
          {
            interpolatingStyle => (
              <div className={className} style={interpolatingStyle}>
                <div className={s.dialog}>
                  <div className={s.header}>
                    <h1 className={s.heading}>{this.props.title}</h1>
                    <div className={s.controls}>
                      <IconButton
                        className={s.closeButton}
                        btnStyle="link"
                        icon="times"
                        onClick={this.props.onClickClose}
                      />
                    </div>
                  </div>
                  <div className={bodyClassName}>
                    {this.props.children}
                  </div>
                  {modalFooter}
                </div>
              </div>
            )
          }
        </Motion>
      </Portal>
    );
  }

}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClickClose: PropTypes.func.isRequired,
  wide: PropTypes.bool,
  footer: PropTypes.node,
  isOpened: PropTypes.bool,
  bodyClassName: PropTypes.string
};

export default Modal;
