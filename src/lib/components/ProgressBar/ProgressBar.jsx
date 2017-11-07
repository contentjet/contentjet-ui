import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import s from './ProgressBar.css';


function ProgressBar(props) {

  let percentage = props.progress * 100;
  let innerStyle = { width: `${percentage}%` };
  let className = classnames(
    s.progressBar,
    props.className,
    {
      [s.complete]: percentage === 100
    }
  );
  return (
    <div className={className}>
      <div className={s.bar} style={innerStyle}></div>
    </div>
  );

}
ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};


export default ProgressBar;
