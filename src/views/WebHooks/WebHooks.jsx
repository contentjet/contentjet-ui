import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WebHookSelectors from 'selectors/WebHookSelectors';
import WebHookActions from 'actions/WebHookActions';
import Panel from 'lib/components/Panel';
import Alert from 'lib/components/Alert';
import List from 'lib/components/List';
import {List as IList} from 'immutable';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import WebHook from './components/WebHook';
import WebHookModal from './components/WebHookModal';
import Button from 'lib/components/Button';
import ConfirmModal from 'lib/components/ConfirmModal';
import s from './WebHooks.css';


class WebHooks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDeleteModalOpen: false,
      editWebHookModalOpen: false,
      newWebHookModalOpen: false,
      webHookToDelete: null,
      webHookToEdit: null
    };
    this.onNewWebHookClick = this.onNewWebHookClick.bind(this);
    this.onClickDeleteWebHook = this.onClickDeleteWebHook.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.onClickEditWebHook = this.onClickEditWebHook.bind(this);
  }

  componentWillMount() {
    this.props.listWebHooks(this.props.params.project_id);
  }

  onNewWebHookClick() {
    this.setState({ newWebHookModalOpen: true });
  }

  onConfirmDelete() {
    this.props.deleteWebHook(
      this.props.params.project_id,
      this.state.webHookToDelete.id
    );
    this.setState({
      confirmDeleteModalOpen: false,
      webHookToDelete: null
    });
  }

  onCancelModal() {
    this.setState({
      confirmDeleteModalOpen: false,
      editWebHookModalOpen: false,
      newWebHookModalOpen: false,
      webHookToDelete: null,
      webHookToEdit: null
    });
  }

  onClickDeleteWebHook(webHook) {
    this.setState({
      webHookToDelete: webHook,
      confirmDeleteModalOpen: true
    });
  }

  onClickEditWebHook(webHook) {
    this.setState({
      webHookToEdit: webHook,
      editWebHookModalOpen: true
    });
  }

  render() {
    const { isFetching } = this.props;
    const webHooks = this.props.webHooks.toJS();

    const panelFooter = (
      <Button
        btnStyle="primary"
        onClick={this.onNewWebHookClick}
        disabled={isFetching}
      >
        New Web Hook
      </Button>
    );

    var content;
    if (isFetching) {
      content = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else if (webHooks.length) {
      content = (
        <List className={s.webHooksList}>
          {
            webHooks.map(webHook => {
              return (
                <li className={s.item} key={webHook.id}>
                  <WebHook
                    webHook={webHook}
                    onClickDelete={this.onClickDeleteWebHook}
                    onClickEdit={this.onClickEditWebHook}
                  />
                </li>
              );
            })
          }
        </List>
      );
    } else {
      content = (
        <Alert className={s.alert}>
          Click the button below to create your first Web Hook.
        </Alert>
      );
    }

    return (
      <div>
        <Panel header="Web Hooks" footer={panelFooter} footerTextAlign="right">
          { content }
        </Panel>

        <WebHookModal
          projectId={this.props.params.project_id}
          closeModal={this.onCancelModal}
          isOpened={this.state.newWebHookModalOpen}
        />
        <WebHookModal
          webHook={this.state.webHookToEdit}
          projectId={this.props.params.project_id}
          closeModal={this.onCancelModal}
          isOpened={this.state.editWebHookModalOpen}
        />
        <ConfirmModal
          onAccept={this.onConfirmDelete}
          onCancel={this.onCancelModal}
          isOpened={this.state.confirmDeleteModalOpen}
        >
          Are you sure you want to permanently delete this Web Hook?
        </ConfirmModal>
      </div>
    );
  }

}

WebHooks.propTypes = {
  params: PropTypes.object.isRequired,
  listWebHooks: PropTypes.func.isRequired,
  deleteWebHook: PropTypes.func.isRequired,
  webHooks: PropTypes.instanceOf(IList).isRequired,
  isFetching: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    webHooks: WebHookSelectors.listData(state),
    isFetching: WebHookSelectors.listIsFetching(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listWebHooks: (projectId) => {
      dispatch(WebHookActions.list(projectId));
    },
    deleteWebHook: (projectId, webHookId) => {
      dispatch(WebHookActions.destroy(projectId, webHookId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebHooks);
