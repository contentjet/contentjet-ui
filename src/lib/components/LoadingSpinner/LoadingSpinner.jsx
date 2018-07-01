import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import s from './LoadingSpinner.css';


function LoadingSpinner(props) {

  const className = classnames(
    s.loadingSpinner,
    {
      [s.mini]: props.mini,
      [s.slow]: props.slow,
      [s.fast]: props.fast
    },
    props.className
  );
  const style = {};
  if (props.color) style.borderLeftColor = props.color;
  if (props.backgroundColor) {
    style.borderBottomColor = props.backgroundColor;
    style.borderRightColor = props.backgroundColor;
    style.borderTopColor = props.backgroundColor;
  }
  return(
    <div className={className} style={style}>Loading</div>
  );

}
LoadingSpinner.propTypes = {
  mini: PropTypes.bool,
  slow: PropTypes.bool,
  fast: PropTypes.bool,
  color: PropTypes.string,
  backgroundColor: PropTypes.string
};



export default LoadingSpinner;
