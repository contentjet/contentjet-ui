import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Motion, spring } from 'react-motion';
import classnames from 'classnames';
import IconButton from 'lib/components/IconButton';
import Button from 'lib/components/Button';
import s from './EntryTypeFieldItem.css';


const ITEM_HEIGHT = 54;

const springConfig = { stiffness: 160, damping: 15 };

class EntryTypeFieldItem extends Component {

  constructor(props) {
    super(props);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickMoveUp = this.onClickMoveUp.bind(this);
    this.onClickMoveDown = this.onClickMoveDown.bind(this);
  }

  onClickEdit() {
    this.props.onClickEdit(this.props.entryTypeField);
  }

  onClickDelete() {
    this.props.onClickDelete(this.props.entryTypeField);
  }

  onClickMoveUp() {
    this.props.onClickMoveUp(this.props.entryTypeField);
  }

  onClickMoveDown() {
    this.props.onClickMoveDown(this.props.entryTypeField);
  }

  render() {
    const {entryTypeField, position} = this.props;
    let { className } = this.props;
    className = classnames(
      s.item,
      {
        [s.required]: entryTypeField.get('required'),
        [s.disabled]: entryTypeField.get('disabled')
      },
      className
    );
    return (
      <Motion style={{ top: spring(position * ITEM_HEIGHT, springConfig) }}>
        {
          interpolatingStyle => (
            <li
              className={className}
              style={interpolatingStyle}
              title={entryTypeField.get('name')}
            >
              <div className={s.itemDetails}>
                <strong title="Field label">
                  {entryTypeField.get('label')}
                </strong>
                <span className={s.itemType}>
                  {' - ' + entryTypeField.get('fieldType')}
                </span>
              </div>
              <div className={s.itemControls}>
                <Button
                  btnStyle="link"
                  onClick={this.onClickEdit}
                >
                  Edit
                </Button>
                <IconButton
                  icon="trash-alt"
                  btnStyle="link"
                  onClick={this.onClickDelete}
                />
                <div className={s.reorderButtonsHolder}>
                  <IconButton
                    className={s.reorderButton}
                    title="Move field up"
                    icon="arrow-up"
                    btnStyle="link"
                    onClick={this.onClickMoveUp}
                    disabled={!this.props.canMoveUp}
                  />
                  <IconButton
                    className={s.reorderButton}
                    title="Move field down"
                    icon="arrow-down"
                    btnStyle="link"
                    onClick={this.onClickMoveDown}
                    disabled={!this.props.canMoveDown}
                  />
                </div>
              </div>
            </li>
          )
        }
      </Motion>
    );
  }

}
EntryTypeFieldItem.propTypes = {
  entryTypeField: PropTypes.instanceOf(Map).isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickMoveDown: PropTypes.func.isRequired,
  onClickMoveUp: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  canMoveDown: PropTypes.bool.isRequired,
  position: PropTypes.number
};

export default EntryTypeFieldItem;
