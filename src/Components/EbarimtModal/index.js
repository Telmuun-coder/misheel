import React, {useState} from 'react';
import {StyleSheet, Text, View, Modal, Dimensions} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';

import Button from '../ButtonL';
import Input from '../Input';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const data = [
  {
    label: 'Хувь хүн',
    value: 'per',
  },
  {
    label: 'Байгууллага',
    value: 'org',
  },
];

const Ebarimt = (props) => {
  const [state, setState] = useState({
    type: null,
    register: '',
    valid: false,
  });

  const hevleh = () => {
    const reg = /^\d+$/;
    if (state.type == 'org') {
      if (reg.test(state.register) && (state.register.length == 7 || state.register.length == 10)) {
        props.setShowModal({show: false, ...state});
        props.printEbarimt(state);
      }
      else {
        setState((prev) => ({...prev, valid: true}));
      }
    } else {
      props.setShowModal({show: false, ...state});
      props.printEbarimt(state);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showModal}
      onRequestClose={() => props.setShowModal({show: false})}>
      <View
        style={styles.shadow}
        onStartShouldSetResponder={() => props.setShowModal({show: false})}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Баримт Хэвлэх</Text>
        <RadioButtonRN
          style={styles.radio}
          boxStyle={styles.boxStyle}
          data={data}
          circleSize={10}
          selectedBtn={(e) => setState({type: e.value})}
        />
        {state.type === 'org' && (
          <Input
            max={10}
            title="Register"
            danger={state.valid}
            type={'number'}
            register={true}
            onChange={(e) => setState((prev) => ({...prev, register: e}))}
          />
        )}
        <Button title="хэвлэх" onClick={hevleh} />
      </View>
    </Modal>
  );
};

export default Ebarimt;

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: windowHeight * 0.45,
    marginTop: windowHeight * 0.13,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 16,
    color: '#707070',
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
  boxStyle: {
    width: '45%',
    height: 40,
  },
  radio: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
