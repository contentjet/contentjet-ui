import React, { Component } from 'react';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './Login';
import RequestResetPassword from './RequestResetPassword';
import SetPassword from './SetPassword';
import SignUp from './SignUp';
import AcceptInvite from './AcceptInvite';
import Authenticated from './Authenticated';
import NotFound from './NotFound';
import s from './App.css';

import appleTouchIcon57x57 from 'meta/apple-touch-icon-57x57.png';
import appleTouchIcon60x60 from 'meta/apple-touch-icon-60x60.png';
import appleTouchIcon72x72 from 'meta/apple-touch-icon-72x72.png';
import appleTouchIcon76x76 from 'meta/apple-touch-icon-76x76.png';
import appleTouchIcon114x114 from 'meta/apple-touch-icon-114x114.png';
import appleTouchIcon120x120 from 'meta/apple-touch-icon-120x120.png';
import appleTouchIcon144x144 from 'meta/apple-touch-icon-144x144.png';
import appleTouchIcon152x152 from 'meta/apple-touch-icon-152x152.png';
import appleTouchIcon180x180 from 'meta/apple-touch-icon-180x180.png';
import favicon32x32 from 'meta/favicon-32x32.png';
import 'meta/android-chrome-36x36.png';
import 'meta/android-chrome-48x48.png';
import 'meta/android-chrome-72x72.png';
import 'meta/android-chrome-96x96.png';
import 'meta/android-chrome-144x144.png';
import androidChrome192x192 from 'meta/android-chrome-192x192.png';
import 'meta/favicon.ico';
import favicon96x96 from 'meta/favicon-96x96.png';
import favicon16x16 from 'meta/favicon-16x16.png';
import manifestJSON from 'meta/manifest.json';
import safariPinnedTab from 'meta/safari-pinned-tab.svg';
import 'meta/mstile-70x70.png';
import mstile144x144 from 'meta/mstile-144x144.png';
import 'meta/mstile-150x150.png';
import 'meta/mstile-310x150.png';
import 'meta/mstile-310x310.png';


class App extends Component {

  render() {
    const className = classnames(s.app, this.props.className);
    return (
      <div className={className}>
        <Helmet
          title="contentjet"
          meta={[
            { name: 'apple-mobile-web-app-title', content: 'contentjet.io' },
            { name: 'application-name', content: 'contentjet.io' },
            { name: 'msapplication-TileColor', content: '#da532c' },
            { name: 'msapplication-TileImage', content: mstile144x144 },
            { name: 'theme-color', content: '#fd1555' },
            { name: 'description', content: '' }
          ]}
          link={[
            { rel: 'apple-touch-icon', sizes: '57x57', href: appleTouchIcon57x57 },
            { rel: 'apple-touch-icon', sizes: '60x60', href: appleTouchIcon60x60 },
            { rel: 'apple-touch-icon', sizes: '72x72', href: appleTouchIcon72x72 },
            { rel: 'apple-touch-icon', sizes: '76x76', href: appleTouchIcon76x76 },
            { rel: 'apple-touch-icon', sizes: '114x114', href: appleTouchIcon114x114 },
            { rel: 'apple-touch-icon', sizes: '120x120', href: appleTouchIcon120x120 },
            { rel: 'apple-touch-icon', sizes: '144x144', href: appleTouchIcon144x144 },
            { rel: 'apple-touch-icon', sizes: '152x152', href: appleTouchIcon152x152 },
            { rel: 'apple-touch-icon', sizes: '180x180', href: appleTouchIcon180x180 },
            { rel: 'icon', type: 'image/png', href: favicon32x32, sizes: '32x32' },
            { rel: 'icon', type: 'image/png', href: androidChrome192x192, sizes: '192x192' },
            { rel: 'icon', type: 'image/png', href: favicon96x96, sizes: '96x96' },
            { rel: 'icon', type: 'image/png', href: favicon16x16, sizes: '16x16' },
            { rel: 'manifest', href: manifestJSON },
            { rel: 'mask-icon', href: safariPinnedTab, color: '#5bbad5' }
          ]}
        />
        <div className={s.content}>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route path="/login" component={Login} />
            <Route path="/reset-password" component={RequestResetPassword} />
            <Route path="/set-password/:token" component={SetPassword} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/accept-invite/:invite_token" component={AcceptInvite} />
            <Route path="/" component={Authenticated} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
