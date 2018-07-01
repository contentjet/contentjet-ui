import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'underscore.string';
import classnames from 'classnames';
import Button from 'lib/components/Button';
import s from './UserTable.css';


const UserTable = (props) => {
  const { users, onClickEditUser } = props;
  let { className } = props;
  className = classnames(s.userTable, className);
  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Type</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          users.map(user => {
            return (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{capitalize(user.membershipType)}</td>
                <td>{user.membershipIsActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button
                    className={s.editButton}
                    btnStyle="link"
                    onClick={() => onClickEditUser(user)}
                    block
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};
UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onClickEditUser: PropTypes.func.isRequired
};


export default UserTable;
