import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import EntryActions from 'actions/EntryActions';
import EntrySelectors from 'selectors/EntrySelectors';
import { List as IList } from 'immutable';
import { immutableMove } from 'lib/utils/ImmutableUtils';
import Button from 'lib/components/Button';
import IconButton from 'lib/components/IconButton';
import Modal from 'lib/components/Modal';
import Input from 'lib/components/Input';
import List from 'lib/components/List';
import CheckboxListItem from 'lib/components/CheckboxListItem';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import { Motion, spring } from 'react-motion';
import s from './EntryPickerModal.css';


const springConfig = { stiffness: 160, damping: 15 };

class EntryPickerModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: IList(),
      selectedEntries: this.props.initialSelectedEntries || IList(),
      search: ''
    };
    this.listEntries = this.listEntries.bind(this);
    this.onOkClickHandler = this.onOkClickHandler.bind(this);
    this.onSearchChange = _.debounce(this.onSearchChange.bind(this), 500);
    this.onSelectToggle = this.onSelectToggle.bind(this);
    this.entryIsSelected = this.entryIsSelected.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.entries !== this.state.entries) {
      state.entries = nextProps.entries;
    }
    if (!this.props.isOpened && nextProps.isOpened) {
      this.listEntries();
      state.selectedEntries = nextProps.initialSelectedEntries || IList();
    }
    this.setState(state);
  }

  listEntries(page) {
    this.props.listEntries(
      this.props.projectId,
      {
        search: this.state.search,
        page: page
      }
    );
  }

  onOkClickHandler() {
    this.props.onAccept(this.state.selectedEntries);
  }

  onSearchChange(value) {
    this.setState({ search: value }, this.listEntries);
  }

  onSelectToggle(entry, selected) {
    let selectedEntries = this.state.selectedEntries;
    if (selected) {
      selectedEntries = selectedEntries.push(entry);
    } else {
      selectedEntries = selectedEntries.filter(_entry => _entry.id !== entry.id);
    }
    this.setState({ selectedEntries });
  }

  entryIsSelected(entry) {
    const selectedEntryIds = this.state.selectedEntries.map(item => item.id);
    return selectedEntryIds.includes(entry.id);
  }

  onMove(fromIndex, toIndex) {
    const selectedEntries = immutableMove(this.state.selectedEntries, fromIndex, toIndex);
    this.setState({ selectedEntries });
  }

  render() {
    let { entries } = this.state;
    const selectedEntries = this.state.selectedEntries.toJS();
    const {
      excludedEntryIds, onCancel, isOpened, isFetching, page, totalPages
    } = this.props;

    const footer = [
      <Button
        key="cancel-button"
        btnStyle="link"
        onClick={onCancel}
      >
        Cancel
      </Button>,
      <Button
        key="ok-button"
        btnStyle="primary"
        onClick={this.onOkClickHandler}
      >
        OK
      </Button>
    ];

    entries = entries.filter(entry => {
      return !_.includes(excludedEntryIds, entry.get('id'));
    }).toJS();

    var leftColumnContent;
    if (isFetching) {
      leftColumnContent = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else {
      const items = entries.map(entry => {
        return (
          <CheckboxListItem
            key={entry.id}
            onChange={_.partial(this.onSelectToggle, entry)}
            checked={this.entryIsSelected(entry)}
          >
            { entry.name }
          </CheckboxListItem>
        );
      });

      if (totalPages > 1) {
        let previousButton;
        let nextButton;
        if (page > 1) {
          previousButton = (
            <IconButton
              icon="arrow-left"
              onClick={_.partial(this.listEntries, page - 1)}
              buttonGroup
            >
              Previous page
            </IconButton>
          );
        }
        if (page < totalPages) {
          nextButton = (
            <IconButton
              icon="arrow-right"
              onClick={_.partial(this.listEntries, page + 1)}
              buttonGroup
              alignIconRight
            >
              Next page
            </IconButton>
          );
        }
        items.push(
          <li className={s.buttonsItem} key="buttons">
            { previousButton }
            { nextButton }
          </li>
        );
      }

      leftColumnContent = (
        <List className={s.list}>{ items }</List>
      );
    }

    return (
      <Modal
        title="Entries"
        onClickClose={onCancel}
        footer={footer}
        isOpened={isOpened}
        wide
      >
        <div className={s.controls}>
          <div className={s.column}>
            <Input
              className={s.searchInput}
              type="search"
              name="search"
              placeholder="Search"
              onChange={this.onSearchChange}
            />
          </div>
        </div>

        <div className={s.listHolder}>
          <div className={s.column}>
            { leftColumnContent }
          </div>
          <div className={s.column}>
            <List className={s.list}>
              {
                selectedEntries.map((entry, i) => {
                  return (
                    <Motion key={entry.id} style={{ y: spring(i * 39, springConfig) }}>
                      {
                        interpolatingStyle => {
                          return (
                            <CheckboxListItem
                              style={{ transform: `translateY(${interpolatingStyle.y}px)` }}
                              className={s.listItem}
                              onChange={_.partial(this.onSelectToggle, entry)}
                              checked={this.entryIsSelected(entry)}
                              onClickUp={_.partial(this.onMove, i, i - 1)}
                              onClickDown={_.partial(this.onMove, i, i + 1)}
                              upButtonDisabled={i === 0}
                              downButtonDisabled={i === selectedEntries.length - 1}
                            >
                              { entry.name }
                            </CheckboxListItem>
                          );
                        }
                      }
                    </Motion>
                  );
                })
              }
            </List>
          </div>
        </div>

      </Modal>
    );
  }

}

EntryPickerModal.propTypes = {
  entries: PropTypes.instanceOf(IList).isRequired,
  isFetching: PropTypes.bool,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  listEntries: PropTypes.func.isRequired,
  excludedEntryIds: PropTypes.array,
  initialSelectedEntries: PropTypes.instanceOf(IList),
  isOpened: PropTypes.bool
};

const mapStateToProps = (state) => {
  return {
    entries: EntrySelectors.listDataResults(state),
    isFetching: EntrySelectors.listIsFetching(state),
    page: EntrySelectors.listData(state).get('page'),
    totalPages: EntrySelectors.listData(state).get('totalPages')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listEntries: (projectId, queryParams) => {
      dispatch(EntryActions.list(projectId, queryParams));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EntryPickerModal);
