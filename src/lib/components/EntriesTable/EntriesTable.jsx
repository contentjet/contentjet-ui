import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';
import Input from 'lib/components/Input';
import s from './EntriesTable.css';


class EntriesTable extends Component {

  constructor(props) {
    super(props);
    this.entryIsSelected = this.entryIsSelected.bind(this);
  }

  entryIsSelected(entry) {
    let selectedEntry = _.find(
      this.props.selectedEntries, _entry => _entry.id === entry.id
    );
    return !_.isUndefined(selectedEntry);
  }

  render() {
    const {entries, toggleSelect, projectId} = this.props;
    if (!entries.length) return null;
    const rows = entries.map(entry => {
      return (
        <tr key={entry.id}>
          <td>
            <Input
              type="checkbox"
              className={s.checkbox}
              labelClassName={s.checkboxLabel}
              name={entry.name}
              value={this.entryIsSelected(entry)}
              onChange={() => toggleSelect(entry)}
            />
          </td>
          <td>
            <Link to={`/project/${projectId}/entries/${entry.entryTypeId}/${entry.id}`}>
              {entry.name}
            </Link>
          </td>
          <td>
            {entry.tags.join(', ')}
          </td>
          <td>
            {entry.entryType.name}
          </td>
          <td>
            {entry.modifiedByUser.name}
          </td>
          <td>
            {moment(entry.published).format('ddd, MMM Do YYYY, h:mm a')}
          </td>
          <td>
            {moment(entry.modified).format('ddd, MMM Do YYYY, h:mm a')}
          </td>
        </tr>
      );
    });
    const className = classnames(s.entriesTable, this.props.className);
    return (
      <table className={className}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Tags</th>
            <th>Entry type</th>
            <th>Last modified by</th>
            <th>Published</th>
            <th>Modified on</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

}
EntriesTable.propTypes = {
  entries: PropTypes.array.isRequired,
  selectedEntries: PropTypes.array.isRequired,
  toggleSelect: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
};


export default EntriesTable;
