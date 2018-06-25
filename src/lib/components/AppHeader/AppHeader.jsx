import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import Logo from 'lib/components/Logo';
import FontAwesome from 'lib/components/FontAwesome';
import LogoutButton from 'lib/components/LogoutButton';
import s from './AppHeader.css';


const AppHeader = (props) => {
  let { className, onClickLogout, userName } = props;
  className = classnames(s.appHeader, className);
  return (
    <div className={className}>
      <Link className={s.logoLink} to="/projects">
        <Logo className={s.logo} white />
      </Link>
      <div>
        <Link className={s.profileLink} to="/settings/profile">
          <FontAwesome name="user" />
          <span className={s.profileLinkText}>{ userName }</span>
        </Link>
        <LogoutButton
          className={s.logoutButton}
          onClick={onClickLogout}
        />
      </div>
    </div>
  );
};
AppHeader.propTypes = {
  onClickLogout: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired
};


export default AppHeader;
