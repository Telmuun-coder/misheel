import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {UserState} from '../../Context/UserStore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShowNumbers = (props) => {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const {state} = useContext(UserState);
  const onClick = (e) => {
    let tmp = props.value;
    tmp[props.index] = e;
    props.click([...tmp]);
    props.setShowModal();
    // console.log(props.value)
    // console.log("ene sdaaag hardaaa: ", e);
  };

  return (
    // <View style={styles.container} >
    <Modal
      // animationType="slide"
      transparent={true}
      visible={true}>
      <View
        style={styles.shadow}
        onStartShouldSetResponder={() => props.setShowModal()}
      />
      <View
        style={[
          styles.modalStyle,
          state.userRole === 'POSTPOS'
            ? {left: windowWidth * 0.035 + props.index * windowWidth * 0.134} //POSTPOS
            : {left: windowWidth * 0.105 + props.index * windowWidth * 0.133}, //SELFPOS
        ]}>
        {nums.map((e) => (
          <TouchableHighlight
            key={e}
            activeOpacity={0.5}
            underlayColor="#DDDDDD"
            onPress={() => onClick(e)}>
            <View style={styles.touch}>
              <Text style={styles.tsipr}>{e}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: -50,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    // backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalStyle: {
    position: 'absolute',
    top: 95,
    left: 85, //[85,61+61+61] eiig
    width: windowWidth * 0.13,
    height: windowHeight * 0.57,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tsipr: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  touch: {
    width: 60,
    //   backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    //flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
  },
});

export default ShowNumbers;
