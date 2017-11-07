import React from 'react';
import PropTypes from 'prop-types';
import logo from 'images/contentjet-logo.svg';
import logoWhite from 'images/contentjet-logo-white.svg';


const Logo = (props) => {
  let { className, white } = props;
  let src = white ? logoWhite : logo;
  return (
    <img className={className} src={src} title="contentjet" alt="logo" />
  );
};
Logo.propTypes = {
  white: PropTypes.bool
};


export default Logo;
