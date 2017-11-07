import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Input from 'lib/components/Input';
import classnames from 'classnames';
import s from './InviteTable.css';


class InviteTable extends Component {

  constructor(props) {
    super(props);
    this.inviteIsSelected = this.inviteIsSelected.bind(this);
  }

  inviteIsSelected(invite) {
    let selectedEntry = _.find(
      this.props.selectedInvites, _invite => _invite.id === invite.id
    );
    return !_.isUndefined(selectedEntry);
  }

  render() {
    let { className, invites } = this.props;
    className = classnames(s.inviteTable, className);
    return (
      <table className={className}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {
            invites.map(invite => {
              return (
                <tr key={invite.id}>
                  <td>
                    <Input
                      type="checkbox"
                      className={s.checkbox}
                      labelClassName={s.checkboxLabel}
                      name={String(invite.id)}
                      value={this.inviteIsSelected(invite)}
                      onChange={() => this.props.toggleSelect(invite)}
                    />
                  </td>
                  <td>{invite.name}</td>
                  <td>{invite.email}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}
InviteTable.propTypes = {
  invites: PropTypes.array.isRequired,
  selectedInvites: PropTypes.array.isRequired,
  toggleSelect: PropTypes.func.isRequired
};


export default InviteTable;
