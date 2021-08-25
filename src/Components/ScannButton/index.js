import React from 'react';
import {StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const ScannButton = (props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress} disabled={props.disabled}>
      <Icon name="qrcode" color="black" size={40} />
    </TouchableOpacity>
  );
};

export default ScannButton;

const styles = StyleSheet.create({
  container: {
    width: WINDOWS_WIDTH * 0.13,
    height: WINDOWS_WIDTH * 0.13,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#D81E21',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
    // elevation: 5,
  },
  text: {
    color: '#FEFDFF',
  },
});
