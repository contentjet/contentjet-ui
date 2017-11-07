import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import FontAwesome from 'lib/components/FontAwesome';
import List from 'lib/components/List';
import s from './EntryTypeList.css';


const EntryTypeList = (props) => {
  let { entryTypes, projectId, className } = props;
  className = classnames(s.entryTypeList, className);
  return (
    <List className={className}>
      {
        entryTypes.map(entryType => {
          return (
            <li className={s.item} key={entryType.id}>
              <Link to={`/project/${projectId}/entry-types/edit/${entryType.id}`}>
                <FontAwesome
                  name="database"
                  className={s.itemIcon}
                />
                {entryType.name}
              </Link>
            </li>
          );
        })
      }
    </List>
  );
};
EntryTypeList.propTypes = {
  projectId: PropTypes.string.isRequired,
  entryTypes: PropTypes.array.isRequired
};


export default EntryTypeList;
