import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List as IList } from 'immutable';
import classnames from 'classnames';
import List from 'lib/components/List';
import EntryTypeFieldItem from './components/EntryTypeFieldItem';
import s from './EntryTypeFieldList.css';


const ITEM_HEIGHT = 54;


class EntryTypeFieldList extends Component {

  render() {
    const {
      entryTypeFields,
      onClickDeleteField,
      onClickEditField,
      onClickMoveUp,
      onClickMoveDown
    } = this.props;
    if (entryTypeFields) {
      var entryTypeFieldItems = entryTypeFields.map((item, i) => {
        return (
          <EntryTypeFieldItem
            entryTypeField={item}
            canMoveUp={i !== 0}
            canMoveDown={i !== entryTypeFields.count() - 1}
            position={i}
            onClickDelete={onClickDeleteField}
            onClickEdit={onClickEditField}
            onClickMoveUp={onClickMoveUp}
            onClickMoveDown={onClickMoveDown}
            key={item.get('name')}
          />
        );
      }, this).toJS();
    }

    const className = classnames(s.entryTypeFieldList, this.props.className);
    const style = {
      height: entryTypeFieldItems ? entryTypeFieldItems.length * ITEM_HEIGHT : 0
    };
    return (
      <List className={className} style={style}>
        {entryTypeFieldItems}
      </List>
    );
  }

}
EntryTypeFieldList.propTypes = {
  onClickDeleteField: PropTypes.func.isRequired,
  onClickEditField: PropTypes.func.isRequired,
  onClickMoveUp: PropTypes.func.isRequired,
  onClickMoveDown: PropTypes.func.isRequired,
  entryTypeFields: PropTypes.instanceOf(IList)
};


export default EntryTypeFieldList;
