import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import s from './Button.css';


function Button(props) {
  const {
    btnStyle, block, processing, loadingSpinnerColor,
    loadingSpinnerBackgroundColor, children, to, hide, buttonGroup
  } = props;

  if (hide) return null;

  const className = classnames(
    s.button,
    {
      [s.buttonDefault]: !btnStyle || btnStyle === 'default',
      [s.buttonPrimary]: btnStyle === 'primary',
      [s.buttonDanger]: btnStyle === 'danger',
      [s.buttonLink]: btnStyle === 'link',
      [s.block]: block,
      [s.processing]: processing,
      [s.buttonGroup]: buttonGroup
    },
    props.className
  );

  let spinner;
  if (processing) {
    spinner = (
      <LoadingSpinner
        className={s.spinner}
        color={loadingSpinnerColor || '#fff'}
        backgroundColor={loadingSpinnerBackgroundColor}
        mini
      />
    );
  }

  // NOTE: If the 'to' property is passed we render the button as
  // a react-router <Link> instead of a standard <button> :)

  const elementProps = _.omit(
    props,
    [
      'processing', 'block', 'btnStyle', 'loadingSpinnerColor',
      'loadingSpinnerBackgroundColor', 'to', 'hide', 'buttonGroup'
    ]
  );

  if (to) {
    if(_.startsWith(to, 'http://') || _.startsWith(to, 'https://')) {
      return (
        <a {...elementProps} href={to} className={className}>
          {spinner}
          <span className={s.content}>
            {children}
          </span>
        </a>
      );
    } else {
      return (
        <Link {...elementProps} to={to} className={className}>
          {spinner}
          <span className={s.content}>
            {children}
          </span>
        </Link>
      );
    }
  }

  return (
    <button {...elementProps} className={className}>
      {spinner}
      <span className={s.content}>
        {children}
      </span>
    </button>
  );
}

Button.propTypes = {
  btnStyle: PropTypes.string,
  block: PropTypes.bool,
  processing: PropTypes.bool,
  loadingSpinnerColor: PropTypes.string,
  loadingSpinnerBackgroundColor: PropTypes.string,
  to: PropTypes.string,
  hide: PropTypes.bool,
  buttonGroup: PropTypes.bool
};

export default Button;
