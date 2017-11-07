import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Map } from 'immutable';
import UserActions from 'actions/UserActions';
import UserSelectors from 'selectors/UserSelectors';
import List from 'lib/components/List';
import AppHeader from 'lib/components/AppHeader';
import AuthenticationActions from 'actions/AuthenticationActions';
import s from './Settings.css';


class Settings extends Component {

  componentDidMount() {
    this.props.getMe();
  }

  render() {
    const { logout, me, children } = this.props;

    return (
      <div className={s.settings}>
        <AppHeader
          onClickLogout={logout}
          userName={me.get('name', '')}
        />
        <div className={s.content}>
          <div className={s.sidebar}>
            <nav>
              <List>
                <li>
                  <Link
                    className={s.link}
                    activeClassName={s.linkActive}
                    to={'/settings/profile'}
                  >
                    My Profile
                  </Link>
                </li>
              </List>
            </nav>
          </div>
          <div className={s.contentBody}>
            { children }
          </div>
        </div>
      </div>
    );
  }

}
Settings.propTypes = {
  getMe: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  me: PropTypes.instanceOf(Map).isRequired
};


const mapStateToProps = (state) => {
  return {
    me: UserSelectors.me(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    getMe: () => {
      dispatch(UserActions.getMe());
    },
    logout: () => {
      dispatch(AuthenticationActions.logout());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
