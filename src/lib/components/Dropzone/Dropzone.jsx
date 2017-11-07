import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import FontAwesome from 'lib/components/FontAwesome';
import s from './Dropzone.css';


function _Dropzone(props) {
  let className = classnames(s.dropzone, props.className);
  return (
    <Dropzone
      {...props}
      className={className}
      activeClassName={s.active}
      onDrop={props.onDrop}
    >
      <FontAwesome className={s.icon} name="cloud-upload" />
      <p>Drop files here to upload.</p>
      <p><small>(or click to select)</small></p>
    </Dropzone>
  );
}
_Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired
};


export default _Dropzone;
