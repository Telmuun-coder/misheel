import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import UserStore from './src/Context/UserStore';
import {name as appName} from './app.json';

const Container = () => (
  <UserStore>
    <App />
  </UserStore>
);

AppRegistry.registerComponent(appName, () => Container);
