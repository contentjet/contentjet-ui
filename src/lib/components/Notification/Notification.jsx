import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Motion, spring } from 'react-motion';
import Portal from 'react-portal';
import FontAwesome from 'lib/components/FontAwesome';
import s from './Notification.css';


const ICON_FOR_STATUS = {
  'success': 'check-circle',
  'error': 'exclamation-circle'
};


function Notification(props) {
  let { className, status, message, show } = props;
  className = classnames(
    s.notification,
    {
      [s.success]: status === 'success',
      [s.error]: status === 'error'
    },
    className
  );

  let style;
  if (show) {
    style = {top: spring(10, {stiffness: 120, damping: 9})};
  } else {
    style = {top: spring(-50, {stiffness: 150, damping: 9})};
  }

  return (
    <Portal isOpened>
      <Motion
        defaultStyle={{top: -50}}
        style={style}
      >
        {
          interpolatingStyle => (
            <div className={className} style={interpolatingStyle}>
              <FontAwesome className={s.icon} name={ICON_FOR_STATUS[status]} />
              <span className={s.message}>{message}</span>
            </div>
          )
        }
      </Motion>
    </Portal>
  );
}
Notification.propTypes = {
  status: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string,
  show: PropTypes.bool
};


export default Notification;
