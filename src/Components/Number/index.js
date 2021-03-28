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

const Number = (props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && (
        <ShowNumbers
          setShowModal={() => setShowModal(false)}
          value={props.value}
          index={props.index}
          click={props.click}
        />
      )}
      <View style={styles.numbers}>
        <TouchableHighlight
          onPress={() => setShowModal((prev) => !prev)}
          style={{flex: 1}}
          activeOpacity={0.6}
          underlayColor="#DDDDDD">
          <View style={styles.content}>
            <Text style={styles.value}>{props.value[props.index]}</Text>
            <Icon name="down" size={20} color="black" style={styles.icon} />
          </View>
        </TouchableHighlight>
      </View>
    </>
  );
};

export default Number;

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
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
