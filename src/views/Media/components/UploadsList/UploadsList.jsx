import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import ProgressBar from 'lib/components/ProgressBar';
import FontAwesome from 'lib/components/FontAwesome';
import List from 'lib/components/List';
import s from './UploadsList.css';


function UploadsListItem(props) {

  const icon = (
    <FontAwesome
      className={s.itemProgressIcon}
      icon={props.uploadState.progress < 1 ? 'arrow-circle-up' : 'check-circle'}
    />
  );
  const className = classnames(
    s.item,
    {
      [s.complete]: props.uploadState.progress === 1
    }
  );
  return (
    <li className={className}>
      <span className={s.itemLabel}>
        {props.uploadState.filename}
      </span>
      <span
        className={s.itemProgressBarHolder}
        title={props.uploadState.progress < 1 ? 'Uploading' : 'Upload complete'}
      >
        <ProgressBar
          className={s.itemProgressBar}
          progress={props.uploadState.progress}
        />
        {icon}
      </span>
    </li>
  );

}
UploadsListItem.propTypes = {
  uploadState: PropTypes.object.isRequired
};


function UploadsList(props) {

  const className = classnames(s.uploadsList, props.className);
  let items = props.uploads.map(uploadState => {
    return (
      <UploadsListItem
        key={uploadState.uploadId}
        uploadState={uploadState}
      />
    );
  });
  items = _(items).reverse().value();
  return (
    <List className={className}>
      {items}
    </List>
  );

}
UploadsList.propTypes = {
  uploads: PropTypes.array.isRequired
};


export default UploadsList;
