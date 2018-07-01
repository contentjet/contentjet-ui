import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import EntryTypeSelectors from 'selectors/EntryTypeSelectors';
import UserSelectors from 'selectors/UserSelectors';
import EntryTypeActions from 'actions/EntryTypeActions';
import Button from 'lib/components/Button';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import Alert from 'lib/components/Alert';
import ContentHeader from 'lib/components/ContentHeader';
import EntryTypeList from './components/EntryTypeList';
import s from './EntryTypes.css';


class EntryTypes extends Component {

  constructor(props) {
    super(props);
    this.onClickCreate = this.onClickCreate.bind(this);
  }

  componentWillMount() {
    const { params, userIsProjectAdmin } = this.props;
    if (!userIsProjectAdmin) {
      // FIXME
      // browserHistory.replace(`/project/${params.projectId}/entries`);
    }
  }

  componentDidMount() {
    this.props.listEntryTypes(this.props.params.project_id);
  }

  onClickCreate() {
    this.context.router.push(`/project/${this.props.params.project_id}/entry-types/edit/`);
  }

  render() {
    const { isFetching, entryTypes, params } = this.props;

    var content;
    if (isFetching) {
      content = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else if (entryTypes.length) {
      content = (
        <EntryTypeList
          entryTypes={entryTypes}
          projectId={params.project_id}
        />
      );
    } else {
      content = (
        <Alert className={s.alert}>
          You have not yet created any entry types.
        </Alert>
      );
    }

    return (
      <div className={s.entryTypes}>
        <ContentHeader title="Entry types">
          <Button
            btnStyle="primary"
            onClick={this.onClickCreate}
          >
            Create new entry type
          </Button>
        </ContentHeader>

        <div className={s.body}>
          { content }
        </div>
      </div>
    );
  }

}

EntryTypes.propTypes = {
  listEntryTypes: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  entryTypes: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  userIsProjectAdmin: PropTypes.bool.isRequired
};

EntryTypes.contextTypes = {
  router: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    entryTypes: EntryTypeSelectors.listData(state).get('results').toJS(),
    isFetching: EntryTypeSelectors.listIsFetching(state),
    userIsProjectAdmin: UserSelectors.userIsProjectAdmin(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listEntryTypes: (projectId) => {
      dispatch(EntryTypeActions.list(projectId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryTypes);
