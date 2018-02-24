import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Link } from 'react-router';
import FontAwesome from 'lib/components/FontAwesome';
import List from 'lib/components/List';
import s from './EntryTypeList.css';


const EntryTypeList = (props) => {
  let { entryTypes, projectId, className } = props;
  entryTypes = _.orderBy(entryTypes, 'name');
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
                <div className={s.content}>
                  <h1 className={s.title}>{entryType.name}</h1>
                  {entryType.description ? (<p className={s.description}>{entryType.description}</p>) : undefined}
                </div>
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
