import React from 'react';
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  Dimensions,
  View,
  Animated,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Button = (props) => {
  const springValue = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(springValue, {
      toValue: 0.95,
      // friction: 10,
      // tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(springValue, {
      toValue: 1,
      friction: 10,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{transform: [{scale: springValue}]}}>
      <TouchableHighlight
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={props.disabled}
        style={[
          {borderRadius: 8, overflow: 'hidden'},
          props.disabled && styles.dis,
        ]}
        onPress={() => props.onClick()}>
        <View style={styles.buttonView}>
          <Text style={styles.title}>{props.title.toUpperCase()}</Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    width: windowWidth * 0.7,
    height: windowHeight * 0.065,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006AB5',
  },
  dis: {
    opacity: 0.5,
  },
  title: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;
