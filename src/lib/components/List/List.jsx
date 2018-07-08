import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Alert from 'lib/components/Alert';
import s from './List.css';


const List = (props) => {
  const { inline, emptyMessage, style } = props;
  let { children } = props;
  const className = classnames(
    s.list,
    {
      [s.inline]: inline
    },
    props.className
  );
  if ((!children || !children.length) && emptyMessage) {
    children = <li><Alert>{ emptyMessage }</Alert></li>;
  }
  return (
    <ul className={className} style={style}>{children}</ul>
  );
};

List.propTypes = {
  emptyMessage: PropTypes.node,
  inline: PropTypes.bool
};

export default List;
