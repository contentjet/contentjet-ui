import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Map } from 'immutable';
import TweenMax from 'gsap';
import classnames from 'classnames';
import IconButton from 'lib/components/IconButton';
import Button from 'lib/components/Button';
import s from './EntryTypeFieldItem.css';


const ITEM_HEIGHT = 54;


class EntryTypeFieldItem extends Component {

  constructor(props) {
    super(props);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickMoveUp = this.onClickMoveUp.bind(this);
    this.onClickMoveDown = this.onClickMoveDown.bind(this);
  }

  componentWillReceiveProps(props) {
    const s = {
      styleTop: _.get(
        this.state, 'styleTop', this.props.position * ITEM_HEIGHT
      )
    };
    TweenMax.to(
      s,
      0.35,
      {
        styleTop: props.position * ITEM_HEIGHT,
        onUpdate: () => { this.setState(s); },
        // eslint-disable-next-line no-undef
        ease: Back.easeOut // Back is a global introduced by TweenMax >:(
      }
    );
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
    let {entryTypeField, className} = this.props;
    const style = {
      top: _.get(this.state, 'styleTop', this.props.position * ITEM_HEIGHT)
    };
    className = classnames(s.item, {[s.required]: entryTypeField.get('required')}, className);
    return (
      <li
        className={className}
        style={style}
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
            iconName="trash-o"
            btnStyle="link"
            onClick={this.onClickDelete}
          />
          <div className={s.reorderButtonsHolder}>
            <IconButton
              className={s.reorderButton}
              title="Move field up"
              iconName="arrow-up"
              btnStyle="link"
              onClick={this.onClickMoveUp}
              disabled={!this.props.canMoveUp}
            />
            <IconButton
              className={s.reorderButton}
              title="Move field down"
              iconName="arrow-down"
              btnStyle="link"
              onClick={this.onClickMoveDown}
              disabled={!this.props.canMoveDown}
            />
          </div>
        </div>
      </li>
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
