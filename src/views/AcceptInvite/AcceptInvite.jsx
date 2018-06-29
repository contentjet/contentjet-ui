import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import { Link } from 'react-router';
import InviteActions from 'actions/InviteActions';
import AuthenticationActions from 'actions/AuthenticationActions';
import CenteredPanelView from 'lib/components/CenteredPanelView';
import ErrorsListAlert from 'lib/components/ErrorsListAlert';
import Button from 'lib/components/Button';
import s from './AcceptInvite.css';


class AcceptInvite extends Component {

  constructor(props) {
    super(props);
    this.state = {
      projectName: null,
      tokenError: false
    };
  }

  componentDidMount() {
    const inviteToken = this.props.params.invite_token.replace(/~/g, '.');
    // Check the inviteToken is a valid JWT
    const decodedToken = jwt.decode(inviteToken);
    if (!decodedToken) {
      this.setState({tokenError: true});
      return;
    }
    const {projectName} = decodedToken;
    this.setState({ projectName });
    this.props.logout();
    this.props.setInviteToken(inviteToken);
  }

  render() {
    const {tokenError, projectName} = this.state;
    let content;
    if (tokenError) {
      content = (
        <ErrorsListAlert errors={['Invalid token']} />
      );
    } else {
      content = (
        <div>
          <p className={s.message}>
            To join the project <span className={s.projectName}>{projectName}</span> simply login.
          </p>
          <Button
            className={s.loginButton}
            btnStyle="primary"
            to="/login"
            block
          >
            Login
          </Button>
          <Link
            className={s.signUp}
            to="/sign-up"
          >
            Don&apos;t have an account? Click here to sign up!
          </Link>
        </div>
      );
    }

    return (
      <CenteredPanelView className={s.acceptInvite}>
        {content}
      </CenteredPanelView>
    );
  }

}
AcceptInvite.propTypes = {
  logout: PropTypes.func.isRequired,
  setInviteToken: PropTypes.func.isRequired
};


const mapDispatchToProps = (dispatch) => {
  return {
    logout() {
      dispatch(AuthenticationActions.logout());
    },
    setInviteToken(token) {
      dispatch(InviteActions.setInviteToken(token));
    }
  };
};


export default connect(null, mapDispatchToProps)(AcceptInvite);
