import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List as IList } from 'immutable';
import ClientSelectors from 'selectors/ClientSelectors';
import ClientActions from 'actions/ClientActions';
import Panel from 'lib/components/Panel';
import Button from 'lib/components/Button';
import Alert from 'lib/components/Alert';
import List from 'lib/components/List';
import LoadingSpinner from 'lib/components/LoadingSpinner';
import ConfirmModal from 'lib/components/ConfirmModal';
import Client from './components/Client';
import ClientModal from './components/ClientModal';
import s from './API.css';


class API extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newClientModalOpen: false,
      clientToDelete: null,
      confirmDeleteModalOpen: false
    };
    this.onNewClientClick = this.onNewClientClick.bind(this);
    this.onClickDeleteClient = this.onClickDeleteClient.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.listClients(this.props.match.params.project_id);
  }

  onNewClientClick() {
    this.setState({ newClientModalOpen: true });
  }

  onClickDeleteClient(client) {
    this.setState({
      clientToDelete: client,
      confirmDeleteModalOpen: true
    });
  }

  onConfirmDelete() {
    this.props.deleteClient(
      this.props.match.params.project_id,
      this.state.clientToDelete.id
    );
    this.setState({
      confirmDeleteModalOpen: false,
      clientToDelete: null
    });
  }

  onCancelModal() {
    this.setState({
      confirmDeleteModalOpen: false,
      newClientModalOpen: false,
      clientToDelete: null,
    });
  }

  render() {
    const { isFetching, match } = this.props;
    const clients = this.props.clients.toJS();

    const panelFooter = (
      <Button
        btnStyle="primary"
        onClick={this.onNewClientClick}
        disabled={isFetching}
      >
        New Client
      </Button>
    );

    var content;
    if (isFetching) {
      content = (
        <LoadingSpinner className={s.loadingSpinner} />
      );
    } else if (clients.length) {
      content = (
        <List className={s.clientList}>
          {
            clients.map(client => {
              return (
                <li className={s.item} key={client.id}>
                  <Client
                    client={client}
                    onClickDelete={this.onClickDeleteClient}
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
          Click the button below to create your first Client.
        </Alert>
      );
    }

    return (
      <div>
        <Panel header="Clients" footer={panelFooter} footerTextAlign="right">
          { content }
        </Panel>

        <ClientModal
          projectId={match.params.project_id}
          closeModal={this.onCancelModal}
          isOpened={this.state.newClientModalOpen}
        />

        <ConfirmModal
          onAccept={this.onConfirmDelete}
          onCancel={this.onCancelModal}
          isOpened={this.state.confirmDeleteModalOpen}
        >
          Are you sure you want to permanently delete this Client?
        </ConfirmModal>
      </div>
    );
  }

}

API.propTypes = {
  listClients: PropTypes.func.isRequired,
  deleteClient: PropTypes.func.isRequired,
  clients: PropTypes.instanceOf(IList).isRequired,
  isFetching: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape()
  }).isRequired
};

const mapStateToProps = (state) => {
  return {
    clients: ClientSelectors.listData(state),
    isFetching: ClientSelectors.listIsFetching(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    listClients: (projectId) => {
      dispatch(ClientActions.list(projectId));
    },
    deleteClient: (projectId, clientId) => {
      dispatch(ClientActions.destroy(projectId, clientId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(API);
