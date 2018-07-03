import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Panel from 'lib/components/Panel';
import Notification from 'lib/components/Notification';
import UserActions from 'actions/UserActions';
import UserSelectors from 'selectors/UserSelectors';
import NotificationSelectors from 'selectors/NotificationSelectors';
import MyProfileForm from './components/MyProfileForm';


const defaultFormData = {
  id: null,
  name: ''
};

class MyProfile extends Component {

  constructor(props) {
    super(props);
    this.state = { formData: defaultFormData };
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.props.getMe();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.me !== this.props.me) {
      let formData;
      if (nextProps.me.isEmpty()) {
        formData = defaultFormData;
      } else {
        formData = {
          id: nextProps.me.get('id'),
          name: nextProps.me.get('name')
        };
      }
      this.setState({ formData });
    }
  }

  onInputChange(value, name) {
    const formData = _.clone(this.state.formData);
    formData[name] = value;
    this.setState({ formData });
  }

  render() {
    const { save, err, isSending, notification } = this.props;

    return (
      <Panel header="My Profile">
        <MyProfileForm
          formData={this.state.formData}
          onInputChange={this.onInputChange}
          onSubmit={save}
          err={err.toJS()}
          isSending={isSending}
        />

        <Notification {...notification.toJS()} />
      </Panel>
    );
  }
}

MyProfile.propTypes = {
  getMe: PropTypes.func.isRequired,
  me: PropTypes.instanceOf(Map).isRequired,
  err: PropTypes.instanceOf(Map).isRequired,
  isSending: PropTypes.bool.isRequired,
  save: PropTypes.func.isRequired,
  notification: PropTypes.instanceOf(Map).isRequired
};

const mapStateToProps = (state) => {
  return {
    me: UserSelectors.me(state),
    err: UserSelectors.meError(state),
    isSending: UserSelectors.meIsSending(state),
    notification: NotificationSelectors.getNotification(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMe: () => {
      dispatch(UserActions.getMe());
    },
    save: (formData) => {
      dispatch(UserActions.saveMe(formData));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
