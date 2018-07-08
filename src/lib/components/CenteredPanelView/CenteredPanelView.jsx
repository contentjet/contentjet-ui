import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Panel from 'lib/components/Panel';
import LogoutButton from 'lib/components/LogoutButton';
import classnames from 'classnames';
import logo from 'images/contentjet-logo.svg';
import s from './CenteredPanelView.css';


class CenteredPanelView extends Component {

  render() {
    const className = classnames(s.centeredPanelView, this.props.className);

    const panelHeader = (
      <div>
        <LogoutButton
          className={s.logoutButton}
          onClick={this.props.onClickLogout}
          hide={!this.props.onClickLogout}
        />
        <Link to="/" className={s.logoLink}>
          <img src={logo} className={s.logo} />
        </Link>
      </div>
    );

    return (
      <div className={className}>
        <Panel
          className={s.panel}
          header={panelHeader}
          headerTextAlign="right"
          footer={this.props.footer}
        >
          {this.props.children}
        </Panel>
      </div>
    );
  }

}

CenteredPanelView.propTypes = {
  onClickLogout: PropTypes.func,
  footer: PropTypes.element
};

export default CenteredPanelView;
