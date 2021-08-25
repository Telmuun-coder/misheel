import React, {useState, useContext, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Touchable,
} from 'react-native';
import Currency from 'react-currency-formatter';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

import {UserState} from '../../Context/UserStore';
import Spinner from '../../Components/Spinner';
import config from '../../../config';

const window_widht = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

const placeholder = {
  label: 'Select a parking type...',
  value: null,
  // color: '#9EA0A4',
  color: 'black',
};

const DiscountAmount = () => {
  let myRef = useRef(null);
  const {state, setStater, auth} = useContext(UserState);
  const [amount, setAmount] = useState();
  const [park, setPark] = useState();
  const [spin, setSpin] = useState(false);
  const {PrintDiscount, PayByCard} = NativeModules;
  const format = (val) => {
    setAmount(val.replace(/[^0-9]/g, ''));
  };

  const Print = async () => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${state.token}`,
    };
    setSpin(true);
    await PayByCard.doData();
    await axios
      .post(`${config.apiMinu}/parking/paMerchant/generateQr`, {
        amount: amount + '',
        parkingId: park,
      })
      .then((res) => {
        setSpin(false);
        if (res.data.message === 'Амжилттай') {
          PrintDiscount.callPrinter(
            JSON.stringify({
              merchantName: state.merchant.merchantName,
              merchantId: state.merchant.merchantId,
              discount: amount,
              qrValue: res.data.entity,
            }),
          );
        }
      })
      .catch((e) => {
        console.log('qr get info awah uyd aldaa garlaa', e);
        setSpin(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Хөнгөлөлтийн хуудас хэвлэх</Text>
      </View>
      <Text style={styles.tailbar}>Зогсоол сонгох</Text>
      <RNPickerSelect
        placeholder={placeholder}
        items={state.parkingList.map((e, i) => {
          return {
            label: e.parkingName,
            value: e.parkingId,
          };
        })}
        onValueChange={(value) => {
          setPark(value);
        }}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 15,
            right: 20,
            // backgroundColor: 'red',
          },
        }}
        value={park}
        useNativeAndroidPickerStyle={false}
        // textInputProps={{underlineColor: 'yellow'}}
        Icon={() => {
          return <Icon name="down" size={24} color="gray" />;
        }}
      />

      <Text style={styles.tailbar}>Хөнгөлөлтийн дүнг оруулах</Text>
      <TextInput
        ref={myRef}
        maxLength={9}
        learTextOnFocus={true}
        selectTextOnFocus={false}
        value={amount}
        onChangeText={(val) => format(val)}
        caretHidden={true}
        // autoFocus={true}
        style={styles.realInputButYouCantSee}
        keyboardType="numeric"
      />
      <TouchableWithoutFeedback
        onPress={() => {
          myRef.current.focus();
        }}>
        <Text style={styles.input}>
          <Currency
            quantity={parseInt(amount) ? parseInt(amount) : 0}
            currency="MNT"
            pattern="##,### !" // Optional
            decimal="," // Optional
            group="," // Optional
          />
        </Text>
      </TouchableWithoutFeedback>
      <View style={styles.btnCon}>
        <TouchableOpacity onPress={Print} style={styles.print}>
          <Text style={{color: 'white'}}>ХЭВЛЭХ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => auth.logout()} style={{marginTop: 50}}>
          <Text style={styles.logoutText}>ГАРАХ</Text>
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
  input: {
    width: '70%',
    padding: 0,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'right',
    fontSize: 30,
    color: '#736c6c',
    paddingHorizontal: 15,
    paddingTop: 3,
  },
  realInputButYouCantSee: {
    backfaceVisibility: 'hidden',
    width: '0%',
    height: '0%',
    // backgroundColor: 'transparent',
    // backgroundColor: 'yellow',
    position: 'absolute',
    top: -10,
    left: -10,
    // zIndex: 10,
    // color: 'red',
    color: 'transparent',
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
    top: 50,
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
