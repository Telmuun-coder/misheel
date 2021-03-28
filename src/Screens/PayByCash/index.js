import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Image,
  TouchableWithoutFeedback,
  NativeModules,
} from 'react-native';
import PayButton from '../../Components/PayButton';
import axios from 'axios';

const PayByCash = () => {
  // const [spinValue, setSpinValue] = useState(new Animated.Value(0));
  const spinValue = new Animated.Value(0);
  const fontValue = new Animated.Value(0);
  const springValue = new Animated.Value(1);
  const {PrintDiscount, PayByCard} = NativeModules;
  const spinning = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const font = fontValue.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 32],
  });
  useEffect(() => {
    spin();
  }, []);

  const spin = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    // Animated.loop(
    Animated.timing(fontValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start();
    // ).start();
  };

  const spring = async () => {
    // springValue.setValue(0.5);
    // Animated.spring(springValue, {
    //   toValue: 1,
    //   friction: 10,
    //   tension: 50,
    //   useNativeDriver: true,
    // }).start();
    const data = [
      {
        organization_id: 29,
        amount: '25200.00',
        vat: '0.00',
        cashAmount: '25200.00',
        nonCashAmount: '0.00',
        cityTax: '0.00',
        districtCode: '24',
        posNo: '',
        customerNo: '',
        billType: '1',
        billIdSuffix: '',
        returnBillId: '',
        taxType: '2',
        invoiceId: '',
        reportMount: '2019-06',
        branchNo: '023',
        stocks: [
          {
            code: '410',
            name: 'test',
            measureUnit: 't',
            qty: '1.00',
            unitPrice: '25200.00',
            totalAmount: '25200.00',
            vat: '0.00',
            barCode: '410',
            cityTax: '0.00',
          },
        ],
        bankTransactions: '',
      },
    ];
    PayByCard.doData().then((e) => console.log('testSwitch:', e));
    // console.log('omg tell mee why you does not work shitty');
    try {
      const res = await axios.get('http://172.16.20.28/mid/v1/test/free');
      console.log('come oon:', res.data);
    } catch (e) {
      console.log('ebarimt post aldaaaaa', e);
    }
    console.log('door ni');
  };

  const onPressIn = () => {
    Animated.spring(springValue, {
      toValue: 0.8,
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
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={spring}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <Animated.Text style={{fontSize: font}}>test</Animated.Text>
      </TouchableWithoutFeedback>
      <Animated.Image
        style={{width: 90, height: 81, transform: [{rotate: spinning}]}}
        source={require('../../Images/logo.png')}
      />
      <Animated.Image
        style={{width: 180, height: 162, transform: [{scale: springValue}]}}
        source={require('../../Images/logo.png')}
      />
    </View>
  );
};

export default PayByCash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'pink',
  },
});
