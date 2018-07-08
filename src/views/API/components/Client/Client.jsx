import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'lib/components/IconButton';
import s from './Client.css';

const Client = ({ client, onClickDelete }) => (
  <div className={s.client}>
    <div className={s.content}>
      <h2 className={s.name}>{ client.name }</h2>
      <h3 className={s.clientId}>Client Id: { client.clientId }</h3>
      <h3 className={s.clientSecret}>Client Secret: { client.clientSecret }</h3>
    </div>
    <div>
      <IconButton
        icon="trash-alt"
        btnStyle="link"
        onClick={() => onClickDelete(client)}
      />
    </div>
  </div>
);

Client.propTypes = {
  client: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    clientId: PropTypes.string,
    clientSecret: PropTypes.string
  }),
  onClickDelete: PropTypes.func.isRequired
};

export default Client;
