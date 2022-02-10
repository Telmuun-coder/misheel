import React, { useState, useContext, useLayoutEffect, useEffect } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Home from './src/Screens/Home';
import ShowPayment from './src/Screens/ShowPayment';
import QRGenerate from './src/Screens/qrGenerate';
import InputDiscountAmount from './src/Screens/InputDiscountAmount';
import Login from './src/Screens/Login';
import { UserState } from './src/Context/UserStore';
import PayByCash from './src/Screens/PayByCash';
import DrawerContent from './src/Screens/DrawerContent';
import Splash from './src/Screens/Splash';
import Settings from './src/Screens/Settings';
import { setSimcard, setIp } from './config';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import EbarimtList from './src/Screens/EbarimtList';
import Printer from './src/Screens/EbarimtList/Printer';

const Drawer = createDrawerNavigator();

const Hanburner = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="Home"
      drawerPosition="left"
      screenOptions={{
        swipeEnabled: true,
      }}>
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: 'ДУГААР ХАЙХ',
        }}
        component={Home}
      />
      <Drawer.Screen name="EbarimtList" component={EbarimtList} />
      <Drawer.Screen name="Printer" component={Printer} />
      <Drawer.Screen name="Settings" component={Settings} />
      {/* <Drawer.Screen name="PayByCash" component={PayByCash} /> */}
      {/* <Drawer.Screen name="ChangePass" component={ChangePass} /> */}
    </Drawer.Navigator>
  );
};

const Stack = createStackNavigator();

const MyStack = () => {
  const { state } = useContext(UserState);
  let returnScreen;
  // Зогсоолын үүдэндэх пос
  if (state.userRole === 'POSTPOS') {
    returnScreen = (
      <>
        <Stack.Screen
          name="Hanburner"
          options={{
            headerShown: false,
          }}
          component={Hanburner}
        />
        <Stack.Screen
          name="ShowPayment"
          options={{
            headerShown: false,
            title: 'Төлбөр төлөх',
            headerTitleAlign: 'center',
          }}
          component={ShowPayment}
        />
      </>
    );
  } else {
    //QR Хэвлэх merchant
    returnScreen = (
      <Stack.Screen
        name="InputDiscountAmount"
        component={InputDiscountAmount}
        options={{ headerShown: false }}
      />
    );
  }

  return <Stack.Navigator>{returnScreen}</Stack.Navigator>;
};

const authStack = createStackNavigator();

const App = () => {
  const { state, showSplash, setState } = useContext(UserState);
  const [splash, setSplash] = useState(true);

  useLayoutEffect(() => {
    const setSetting = async () => {
      const simType = await AsyncStorage.getItem('simType');
      const localId = await AsyncStorage.getItem('localId');
      // console.log(simType);
      if (simType) setSimcard(simType);
      if (localId) setIp(localId);
    };
    setSetting();
  }, []);

  useEffect(() => {
    const restore = async () => {
      const prevState = await AsyncStorage.getItem('state');
      if (prevState != null) {
        const tmp = JSON.parse(prevState);
        setState({ ...tmp });
      }
      SplashScreen.hide();
    };
    restore();
  }, []);

  return (
    <NavigationContainer>
      {
        // splash ? (
        //   <Splash />
        // ) : 
        state.token ? (
          <MyStack />
        ) : (
          <authStack.Navigator>
            <authStack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <authStack.Screen
              name="Settings" component={Settings}
            />
          </authStack.Navigator>
        )}
    </NavigationContainer>
  );
};

export default App;
