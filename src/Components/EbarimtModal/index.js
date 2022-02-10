import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Dimensions, TouchableOpacity, NativeModules } from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
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
  const { PrintDiscount, PayByCard, Generator } = NativeModules;
  const [state, setState] = useState({
    type: 'per',
    register: '',
    companyName: '',
    valid: false,
    found: true
  });

  const checkName = async () => {
    await PayByCard.doWifi();
    axios.get(`http://info.ebarimt.mn/rest/merchant/info?regno=${state.register}`, { headers: { Authorization: null } })
      .then((res) => {
        // {"citypayer": false, "found": true, "lastReceiptDate": null, "name": "МОНГОЛЫН НББҮРТГЭЛИЙН ХҮРЭЭЛЭН", "receiptFound": false, "vatpayer": false, "vatpayerRegisteredDate": ""}
        console.log("company name: ", res.data);
        if (res.data.found)
          setState(prev => ({ ...prev, companyName: res.data.name, found: true }));
        else
          setState(prev => ({ ...prev, companyName: 'Байгууллагын мэдээлэл олдсогүй.', found: false }));
      })
      .catch((e) => console.log('check company name', e));
  };

  const hevleh = () => {
    const reg = /^\d+$/;
    if (state.type == 'org') {
      if (reg.test(state.register) && (state.register.length == 7 || state.register.length == 10)) {
        props.setShowModal();
        props.printEbarimt(state);
      }
      else {
        setState((prev) => ({ ...prev, valid: true }));
      }
    } else {
      props.setShowModal();
      props.printEbarimt(state);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showModal}
      onRequestClose={() => props.setShowModal()}>
      <View
        style={styles.shadow}
        onStartShouldSetResponder={() => props.setShowModal()}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Баримт Хэвлэх</Text>
        <RadioButtonRN
          initial={1}
          style={styles.radio}
          boxStyle={styles.boxStyle}
          data={data}
          circleSize={10}
          selectedBtn={(e) => setState({ type: e.value })}
        />
        {state.type === 'org' && (
          <View style={styles.orgCon}>
            <Text style={[styles.companyName, !state.found && { color: 'red' }]}>{state.companyName}</Text>
            <View style={styles.searcher}>
              <Input
                style={{ width: windowWidth * 0.7 - windowHeight * 0.075 - 10 }}
                max={10}
                title="Register"
                danger={state.valid}
                type={'number'}
                register={true}
                onChange={(e) => setState((prev) => ({ ...prev, register: e }))}
              />
              <TouchableOpacity style={styles.searchBtn} onPress={checkName}>
                <Icon name={'search1'} size={25} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Button title="хэвлэх" onClick={hevleh} disabled={state.type == 'org' && !state.found} />
      </View>
    </Modal>
  );
};

export default Ebarimt;

const styles = StyleSheet.create({
  searcher: {
    flexDirection: 'row',
    width: windowWidth * 0.7,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  searchBtn: {
    width: windowHeight * 0.075,
    height: windowHeight * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006AB5',
    borderRadius: 8
  },
  orgCon: {

  },
  companyName: {
    fontSize: 12,
    color: '#000',
    alignSelf: 'center',
    marginBottom: 10
  },
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
