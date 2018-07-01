import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'lib/components/FontAwesome';


const MAP = {
  'text/plain': 'file-text-o',

  'application/pdf': 'file-pdf-o',

  'application/x-compressed': 'file-archive-o',
  'application/x-zip-compressed': 'file-archive-o',
  'application/zip': 'file-archive-o',
  'multipart/x-zip': 'file-archive-o',

  'video/mp4': 'file-video-o',
  'video/flv': 'file-video-o',
  'video/webm': 'file-video-o',

  'application/msword': 'file-word-o',

  'application/excel': 'file-excel-o',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-excel-o',

  'audio/mpeg': 'file-audio-o',
  'audio/wav': 'file-audio-o'
};

class FileIcon extends Component {

  render() {
    const { className } = this.props;
    const name = _.get(MAP, this.props.mimeType, 'file-o');
    return (
      <FontAwesome className={className} name={name} />
    );
  }

}

FileIcon.propTypes = {
  mimeType: PropTypes.string
};

export default FileIcon;
