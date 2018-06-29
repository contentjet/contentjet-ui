import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import DropdownButton from 'lib/components/DropdownButton';
import List from 'lib/components/List';
import s from './NewEntryDropdownButton.css';


class NewEntryDropdownButton extends Component {

  render() {
    let entryTypes = this.props.entryTypes.map(entryType => {
      return (
        <li key={entryType.id}>
          <Link to={`/project/${this.props.projectId}/entries/${entryType.id}`}>
            {entryType.name}
          </Link>
        </li>
      );
    }, this);

    if (!entryTypes.length) return null;

    return (
      <DropdownButton
        className={s.newEntryDropdownButton}
        btnStyle="primary"
        label="Create new entry"
      >
        <List>
          { entryTypes }
        </List>
      </DropdownButton>
    );
  }

}
NewEntryDropdownButton.propTypes = {
  projectId: PropTypes.string.isRequired,
  entryTypes: PropTypes.array.isRequired
};


export default NewEntryDropdownButton;
