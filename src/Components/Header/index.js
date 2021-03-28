import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Header = ({callback, title}) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="gray"
          onPress={callback}>
          <View style={styles.touch}>
            <Icon name="arrowleft" color="black" size={22} />
          </View>
        </TouchableHighlight>
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  title: {fontWeight: 'bold', fontSize: 20, alignSelf: 'center'},
  icon: {
    position: 'absolute',
    left: 8,
    zIndex: 10,
    overflow: 'hidden',
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  touch: {
    width: 40,
    height: 40,
    borderRadius: 40,
    // backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
