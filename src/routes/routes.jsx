import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import store from 'store';
import AuthenticationSelectors from 'selectors/AuthenticationSelectors';

import AuthenticationActions from 'actions/AuthenticationActions';

import App from 'views/App';

import Login from 'views/Login';

import RequestResetPassword from 'views/RequestResetPassword';
import SetPassword from 'views/SetPassword';

import SignUp from 'views/SignUp';
import SignUpIndex from 'views/SignUpIndex';
import SignUpVerify from 'views/SignUpVerify';
import AcceptInvite from 'views/AcceptInvite';

import NotFound from 'views/NotFound';

import Authenticated from 'views/Authenticated';

import Settings from 'views/Settings';
import MyProfile from 'views/MyProfile';
import ChangePassword from 'views/ChangePassword';

import Projects from 'views/Projects';
import Project from 'views/Project';
import ProjectSettingsRoot from 'views/ProjectSettingsRoot';
import WebHooks from 'views/WebHooks';
import API from 'views/API';
import ProjectMembers from 'views/ProjectMembers';
import ProjectSettings from 'views/ProjectSettings';

import EntryTypes from 'views/EntryTypes';
import EntryTypeEditor from 'views/EntryTypeEditor';
import Entries from 'views/Entries';
import EntryEditor from 'views/EntryEditor';
import Media from 'views/Media';
import MediaEditor from 'views/MediaEditor';


function requireAuth(nextState, replace) {
  let state = store.getState();
  if (!AuthenticationSelectors.isAuthenticated(state)) {
    store.dispatch(
      AuthenticationActions.setRedirectPath(nextState.location.pathname)
    );
    replace('/login');
  }
}

function redirectIfAuthenticated(nextState, replace) {
  let state = store.getState();
  if (AuthenticationSelectors.isAuthenticated(state)) {
    replace('/projects');
  }
}

const routes = (
  <Route component={App}>
    <Redirect from="/" to="login" />
    <Redirect from="/project/:project_id" to="/project/:project_id/entries" />
    <Redirect from="/project/:project_id/settings" to="/project/:project_id/settings/project" />
    <Route path="login" component={Login} onEnter={redirectIfAuthenticated} />
    <Route path="reset-password" component={RequestResetPassword} />
    <Route path="set-password/:token" component={SetPassword} />
    <Route path="sign-up" component={SignUp}>
      <IndexRoute component={SignUpIndex} />
      <Route path="verify/:token" component={SignUpVerify} />
    </Route>
    <Route path="accept-invite/:invite_token" component={AcceptInvite} />
    <Route component={Authenticated} onEnter={requireAuth}>
      <Route path="projects" component={Projects} />
      <Route path="settings" component={Settings}>
        <IndexRedirect to="profile" />
        <Route path="profile" component={MyProfile} />
        <Route path="password" component={ChangePassword} />
      </Route>
      <Route path="project/:project_id" component={Project}>
        <Route path="settings" component={ProjectSettingsRoot}>
          <Route path="project" component={ProjectSettings} />
          <Route path="members" component={ProjectMembers} />
          <Route path="web-hooks" component={WebHooks} />
          <Route path="api" component={API} />
        </Route>
        <Route path="entry-types">
          <IndexRoute component={EntryTypes} />
          <Route path="edit/(:entry_type_id)" component={EntryTypeEditor} />
        </Route>
        <Route path="entries">
          <IndexRoute component={Entries} />
          <Route path=":entry_type_id(/:entry_id)" component={EntryEditor} />
        </Route>
        <Route path="media">
          <IndexRoute component={Media} />
          <Route path=":media_id" component={MediaEditor} />
        </Route>
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
