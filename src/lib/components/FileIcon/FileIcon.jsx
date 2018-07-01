import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'lib/components/FontAwesome';


const MAP = {
  'text/plain': 'file-alt',

  'application/pdf': 'file-pdf',

  'application/x-compressed': 'file-archive',
  'application/x-zip-compressed': 'file-archive',
  'application/zip': 'file-archive',
  'multipart/x-zip': 'file-archive',

  'video/mp4': 'file-video',
  'video/flv': 'file-video',
  'video/webm': 'file-video',

  'application/msword': 'file-word',

  'application/excel': 'file-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file-excel',

  'audio/mpeg': 'file-audio',
  'audio/wav': 'file-audio'
};

class FileIcon extends Component {

  render() {
    const { className } = this.props;
    const name = _.get(MAP, this.props.mimeType, 'file-o');
    return (
      <FontAwesome className={className} icon={name} />
    );
  }

}

FileIcon.propTypes = {
  mimeType: PropTypes.string
};

export default FileIcon;
