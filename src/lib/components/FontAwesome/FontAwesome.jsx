import React from 'react'; 
import PropTypes from 'prop-types';
import classnames from 'classnames';
import 'font-awesome/css/font-awesome.css';


const FontAwesome = (props) => {
  let className = classnames(
    'fa', `fa-${props.name}`, props.className
  );
  return (
    <i {...props} className={className} />
  );
};
FontAwesome.propTypes = {
  name: PropTypes.string
};


export default FontAwesome;
