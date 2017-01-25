/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @providesModule App
 * @flow
 */

'use strict';

import React from 'react';
import LoginScreen from './login/LoginScreen';

var AppState = require('AppState');
// var PushNotificationsController = require('./PushNotificationsController');
// var StyleSheet = require('StyleSheet');
// var F8Navigator = require('F8Navigator');
var CodePush = require('react-native-code-push');
// var View = require('View');
// var StatusBar = require('StatusBar');
var {
  loadConfig,
  loadViewer,
  loadNotifications,
  loadSessions,
  loadFriendsSchedules,
  loadSurveys,
} = require('./actions');
var { updateInstallation } = require('./actions/installation');
var { connect } = require('react-redux');

var { version } = require('./env.js');
import ClogiiTabView from './tabs/ClogiiTabView';
import Player from './player';

var App = React.createClass({
  componentDidMount: function() {
    AppState.addEventListener('change', this.handleAppStateChange);

    // this.props.dispatch(loadViewer());
    // this.props.dispatch(loadNotifications());
    // this.props.dispatch(loadConfig());
    // this.props.dispatch(loadSessions());
    // this.props.dispatch(loadFriendsSchedules());
    // this.props.dispatch(loadSurveys());

    updateInstallation({version});
    CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
  },

  componentWillUnmount: function() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  },

  handleAppStateChange: function(appState) {
    if (appState === 'active') {
      // this.props.dispatch(loadSessions());
      // this.props.dispatch(loadNotifications());
      // this.props.dispatch(loadSurveys());
      CodePush.sync({installMode: CodePush.InstallMode.ON_NEXT_RESUME});
    }
  },

  render: function() {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />;
    }
    // return <Player/>;
    return <ClogiiTabView/>;
  },

});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
  };
}

module.exports = connect(select)(App);
