import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Home from './src/Screens/Home';
import ShowPayment from './src/Screens/ShowPayment';
import QRGenerate from './src/Screens/qrGenerate';
import InputDiscountAmount from './src/Screens/InputDiscountAmount';
import Login from './src/Screens/Login';
import {UserState} from './src/Context/UserStore';
import PayByCash from './src/Screens/PayByCash';
import DrawerContent from './src/Screens/DrawerContent';
import Splash from './src/Screens/Splash';
import Settings from './src/Screens/Settings';

const Drawer = createDrawerNavigator();

const Hanburner = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      initialRouteName="Home"
      drawerPosition="left"
      // drawerContentOptions={{
      //   // activeBackgroundColor: 'red',
      //   // activeTintColor: 'red',
      //   // inactiveTintColor: 'green',
      // }}
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
      <Drawer.Screen name="Settings" component={Settings} />
      {/* <Drawer.Screen name="PayByCash" component={PayByCash} /> */}
      {/* <Drawer.Screen name="ChangePass" component={ChangePass} /> */}
    </Drawer.Navigator>
  );
};

const Stack = createStackNavigator();

const MyStack = () => {
  const {state} = useContext(UserState);
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
        options={{headerShown: false}}
      />
    );
  }

  return <Stack.Navigator>{returnScreen}</Stack.Navigator>;
};

const authStack = createStackNavigator();

const App = () => {
  const {state, showSplash} = useContext(UserState);
  // console.log(state.token);
  return (
    // <PayByCash />
    <NavigationContainer>
      {showSplash ? (
        <Splash />
      ) : state.token ? (
        <MyStack />
      ) : (
        // <authStack.Screen
        //   name="MyStack"
        //   component={MyStack}
        //   options={{headerShown: false}}
        // />
        // <Login />
        <authStack.Navigator>
          <authStack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </authStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
