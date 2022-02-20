import React, { useState, useContext, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard
} from 'react-native';
import Currency from 'react-currency-formatter';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

import { UserState } from '../../Context/UserStore';
import Spinner from '../../Components/Spinner';
import config from '../../../config';

const window_widht = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

const DiscountAmount = () => {
  const myRef = useRef(null);
  const { state, setStater, auth } = useContext(UserState);
  const [amount, setAmount] = useState();
  const [park, setPark] = useState();
  const [spin, setSpin] = useState(false);
  const { PrintDiscount, PayByCard } = NativeModules;
  const format = (val) => {
    setAmount(val.replace(/[^0-9]/g, ''));
  };

  const Print = async () => {
    alert('kke');
    // PayByCard.pay(`${amount}00`, 'MSHLECOPARK')
    //   .then((res) => {
    //     console.log('hariu2: ', res);
    //     // {"code": "-22", "description": "Гүйлгээ цуцлагдсан", "invoice": null, "rrn": ""}

    //     if (res.code == 0) {

    //     } else {
    //       Alert.alert('Уучлаарай.', 'Картаар төлөх үед алдаа гарлаа. Та дахин оролдоно уу.');
    //     }
    //   })
  };

  const focus = () => {
    console.log('gotta focus');
    myRef.current.focus();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Эко-Парк</Text>
      </View>
      <TouchableWithoutFeedback onPress={focus}>
        <View style={styles.inputView}>
          <Text style={styles.input}>
            <Currency
              quantity={amount ? parseInt(amount) : 0}
              currency="MNT"
              pattern="##,### !" // Optional
              decimal="," // Optional
              group="," // Optional
            />
          </Text>
          <TextInput
            ref={myRef}
            maxLength={9}
            learTextOnFocus={true}
            selectTextOnFocus={false}
            value={amount}
            onChangeText={(val) => format(val)}
            caretHidden={true}
            autoFocus={true}
            style={styles.realInputButYouCantSee}
            keyboardType="numeric"
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.btnCon}>
        <TouchableOpacity onPress={Print} style={styles.print}>
          <Text style={{ color: 'white' }}>Төлөх</Text>
        </TouchableOpacity>
      </View>
      <Spinner visible={spin} />
    </View>
  );
};

export default DiscountAmount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    paddingHorizontal: 15,
    paddingTop: 3,
    width: '70%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    // backgroundColor: 'green'
  },
  input: {
    textAlign: 'right',
    padding: 0,
    fontSize: 30,
    color: '#736c6c',
    // backgroundColor: 'red'
  },
  realInputButYouCantSee: {
    // backfaceVisibility: 'hidden',
    width: '160%',
    height: 50,
    textAlign: 'left',
    // backgroundColor: 'transparent',
    // backgroundColor: 'yellow',
    position: 'absolute',
    top: 0,
    left: '-60%',
    // zIndex: 10,
    // color: 'blue',
    color: 'transparent',
    opacity: 0
  },
  print: {
    width: '70%',
    height: 50,
    backgroundColor: '#006AB5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 5,
    zIndex: -1,
  },
  header: {
    position: 'absolute',
    top: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tailbar: {
    color: 'gray',
    alignSelf: 'flex-end',
    marginHorizontal: '20%',
  },
  logoutText: {
    color: 'gray',
  },
  btnCon: {
    zIndex: -1,
    width: '100%',
    flex: 0.3,
    // backgroundColor: 'red',
    alignItems: 'center',
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: window_widht * 0.7,
    height: 50,
    // backgroundColor: 'green',
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: '#736c6c',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
