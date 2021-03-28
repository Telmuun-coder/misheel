import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ShowNumbers from '../showNumbers';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const Numbers = (props) => {
  const num = [0, 1, 2, 3];
  return (
    <>
      {num.map((e) => (
        <View style={styles.numbers} key={e + ''}>
          <TouchableHighlight
            onPress={props.focus}
            style={{flex: 1}}
            activeOpacity={0.6}
            underlayColor="#DDDDDD">
            <View style={styles.content}>
              <Text style={styles.value}>
                {props.value[e] ? props.value[e] : '_'}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      ))}
    </>
  );
};

export default Numbers;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingHorizontal: '10%',
    paddingHorizontal: '3%',
  },
  numbers: {
    backgroundColor: 'white',
    overflow: 'hidden',
    width: WINDOWS_WIDTH * 0.13,
    height: WINDOWS_WIDTH * 0.13,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'gray',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  value: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  icon: {
    paddingTop: 8,
  },
});
