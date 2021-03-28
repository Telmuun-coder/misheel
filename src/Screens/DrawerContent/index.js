import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {DrawerItem, DrawerContentScrollView} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/AntDesign';
import {UserState} from '../../Context/UserStore';

const DrawerContent = (props) => {
  const {auth} = useContext(UserState);
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} style={{flex: 1}}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.setting}
            onPress={() => props.navigation.toggleDrawer()}>
            <Icon name="setting" size={25} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{height: 200}}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => props.navigation.navigate('Home')}>
            <Text style={styles.label}>НҮҮР</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => props.navigation.navigate('Settings')}>
            <Text style={styles.label}>ТОХИРГОО</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              props.navigation.toggleDrawer();
              auth.logout();
            }}>
            <Text style={styles.label}>ГАРАХ</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  setting: {
    zIndex: 100,
    width: 40,
    height: 40,
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  iconContainer: {
    width: '100%',
    // backgroundColor: 'yellow',
    alignItems: 'flex-end',
    paddingRight: 30,
    paddingTop: 30,
  },
  logoContainer: {
    backgroundColor: 'gray',
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {color: '#FFFFFF', fontSize: 16, marginLeft: '20%'},
  item: {
    width: '100%',
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
});
export default DrawerContent;
