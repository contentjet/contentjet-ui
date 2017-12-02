import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconButton from 'lib/components/IconButton';
import Button from 'lib/components/Button';
import s from './WebHook.css';


const WebHook = (props) => {
  let { className, webHook, onClickEdit, onClickDelete } = props;
  className = classnames(s.webHook, className);
  return (
    <div className={className}>
      <div className={s.contentHolder}>
        <span className={s.name}>
          { webHook.name }
        </span>
        <span className={s.url}>
          URL: { webHook.url }
        </span>
        <span className={s.status}>
          Status: { webHook.isActive ? 'Active' : 'Inactive' }
        </span>
      </div>
      <div className={s.controlsHolder}>
        <Button
          btnStyle="link"
          onClick={() => onClickEdit(webHook)}
        >
          Edit
        </Button>
        <IconButton
          iconName="trash-o"
          btnStyle="link"
          onClick={() => onClickDelete(webHook)}
        />
      </div>
    </div>
  );
};
WebHook.propTypes = {
  webHook: PropTypes.object.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired
};


export default WebHook;
