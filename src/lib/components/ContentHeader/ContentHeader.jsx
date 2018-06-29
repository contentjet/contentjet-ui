import React from 'react';
import PropTypes from 'prop-types';
import s from './ContentHeader.css';


const ContentHeader = (props) => {
  return (
    <header className={s.contentHeader}>
      <div className={s.headingHolder}>
        <h1>
          {props.title}
        </h1>
      </div>
      <div className={s.controls}>
        {props.children}
      </div>
    </header>
  );
};
ContentHeader.propTypes = {
  title: PropTypes.string
};


export default ContentHeader;
