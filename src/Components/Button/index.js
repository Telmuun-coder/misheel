import React from 'react';
import { StyleSheet, View, TouchableHighlight, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const Button = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <TouchableHighlight
        onPress={() => props.onPress()}
        style={{ flex: 1 }}
        activeOpacity={0.6}
        underlayColor="#DDDDDD">
        <View style={styles.content}>
          <Icon name={props.icon} size={25} color={props.iconColor ?? "black"} style={styles.icon} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'blue',
    overflow: 'hidden',
    width: WINDOWS_WIDTH * 0.13,
    height: WINDOWS_WIDTH * 0.13,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  icon: {
    //   paddingTop: 8
  },
});
