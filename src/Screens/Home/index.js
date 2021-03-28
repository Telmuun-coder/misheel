import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  StatusBar,
  Alert,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import CarNumbers from '../../Components/CarNumbers';
import Controller from '../../Components/Controller';
import {UserState} from '../../Context/UserStore';
import Spinner from '../../Components/Spinner';
import config from '../../../config';
import ScannButton from '../../Components/ScannButton';

const {width, height} = Dimensions.get('window');

const Home = (props) => {
  const {PayByCard} = NativeModules;
  const [spin, setSpin] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    load: true,
    data: {},
  });
  const [modalLoader, setModalLoader] = useState(true);
  const {setStater} = useContext(UserState);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const scanBarcode = (props) => {
    NativeModules.BarcodeModule.init()
      .then(() => {
        NativeModules.BarcodeModule.scan()
          .then((code) => console.log(code))
          .catch((error) => {
            if (error.code !== 'CANCELLED') {
              Alert.alert('Алдаа гарлаа!', error.message);
            }
          });
      })
      .catch((e) => {
        console.log('qr code unshij ehleh uyd alda garlaa: ', e);
        // this.props.navigation.navigate('CheckoutBarcodeScan', {
        //   callback: this.onBarcodeScan,
      });
  };

  const checkDiscount = (qr) => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${state.token}`,
    };
    // PayByCard.doWifi();
    PayByCard.doData();
    // setQrState((prev) => ({...prev, qrcode: qr}));

    setSpin(true);
    axios
      .post(config.apiMinu + '/parking/paMerchant/checkQr', {
        qrCode: qr.indexOf('000026') == 1 ? qr.slice(7, qr.length - 1) : qr,
        parkingId: state.parkingId,
      })
      .then((res) => {
        setSpin(false);
        if (res.data.message === 'Амжилттай') {
          console.log(qr);
          // cacheSteps(2);
          // cacheData('qrState', {...res.data.entity});
          // AsyncStorage.setItem(
          //   'qrState',
          //   JSON.stringify({...qrState, ...res.data.entity}),
          // );
          // setQrState((prev) => ({
          //   ...prev,
          //   ...res.data.entity,
          // }));
        } else {
          console.log('qrCheck response Error: ', res.data);
          alert('QR шалгах: ' + res.data.message);
        }
      })
      .catch((e) => {
        console.log('checkQR aldaa:', e.message);
        setSpin(false);
      });
  };

  const getCarNumber = async (number) => {
    if (number.length < 4) alert('Та хайх дугаараа оруулна уу.');
    else {
      axios.defaults.headers.common = {
        Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
      };
      PayByCard.doWifi().then((e) => console.log('iim ym ogjin ugsasa:', e));

      setSpin(true);
      axios
        .get(
          config.localIp +
            ':6080/parking-local/paParkingTxn/findByPlateNumber?plateNumber=' +
            number,
        )
        .then((res) => {
          setSpin(false);
          if (res.data.message === 'Амжилттай') {
            // console.log('reallyMe', res.data.message);
            setData([...res.data.entity]);
          } else {
            alert(res.data.message);
          }
        })
        .catch((e) => {
          console.log('getCarNumber aldaa', e.message);
          setSpin(false);
          alert(e.message);
        });
    }
  };
  useEffect(() => {
    const checkCache = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const AlertBeforeGoBack = () =>
        Alert.alert(
          'Анхаар!',
          'Та өмнө нь төлбөр төлөх процессийг гүйцээгээгүй байна. Та үүнийг гүйцээх үү?',
          [
            {
              text: 'ҮГҮЙ',
              onPress: async () => {
                await AsyncStorage.multiRemove(
                  keys.filter((e) => e !== 'state'),
                );
              },
              style: 'cancel',
            },
            {
              text: 'ТИЙМ',
              onPress: () => {
                props.navigation.navigate('ShowPayment', {id: null});
              },
            },
          ],
          {cancelable: false},
        );
      if (keys.length > 1) {
        AlertBeforeGoBack();
      }
    };
    checkCache();
  }, []);

  const getCurrentCars = async () => {
    axios.defaults.headers.common = {
      Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
    };
    try {
      await PayByCard.doWifi();
      setSpin(true);
      const currentCars = await axios.get(
        `${config.localIp}:6080/parking-local/paParkingTxn/currentCars`,
      );
      // console.log('Current Cars: ', currentCars.data.entity);
      setData([...currentCars.data.entity]);
      setSpin(false);
    } catch (error) {
      console.log('get Current number error', error);
      setSpin(false);
    }
  };
  const getCar = async () => {
    setModal({
      data: {},
      load: true,
      visible: true,
    });
    axios.defaults.headers.common = {
      Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
    };
    try {
      await PayByCard.doWifi();
      // setSpin(true);
      const car = await axios.get(
        `${config.localIp}:6080/parking-local/paParkingTxn/latestReadPlate`,
      );
      if (car.data.status == '000') {
        console.log('Current Car: ', car.data.entity);
        setModal({
          data: car.data.entity,
          load: false,
          visible: true,
        });
      } else {
        setModal({
          data: {},
          load: false,
          visible: false,
        });
        alert('Алдаа гарсан байна.');
      }
      // setSpin(false);
    } catch (error) {
      console.log('get Car number error', error);
      // setSpin(false);
    }
  };

  useEffect(() => {
    // axios
    //   .get('http://192.168.160.240:9000/send/29')
    //   .then((res) => console.log(res.data))
    //   .catch((e) => console.log('3n honogt 1', e));

    getCurrentCars();
    // return () => setData([]);
  }, [isFocused]);

  const payByModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: false,
    }));
    // props.navigation.navigate('ShowPayment', {id: modal.data.txnId}); //eniig yg jinken testnii uyer idevhjuulne
    props.navigation.navigate('ShowPayment', {id: '43'});
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={test}>
        <Text>click and test</Text>
      </TouchableOpacity> */}
      {/* <View style={styles.scan}> */}
      {/* <Text>Хөнгөлөлтийн хуудас уншуулах:</Text> */}
      {/* <ScannButton onPress={scanBarcode} /> */}
      {/* </View> */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      {spin ? (
        <Spinner visible={true} />
      ) : (
        <>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modal.visible}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={styles.shadow}
                onStartShouldSetResponder={() =>
                  setModal((prev) => ({...prev, visible: false}))
                }
              />
              <View style={styles.ModalContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.close}
                  onPress={() =>
                    setModal((prev) => ({...prev, visible: false}))
                  }>
                  <Icon name="ios-close" size={30} color="#7E7E7E" />
                </TouchableOpacity>
                <Text>Гарах машины дугаар:</Text>
                {modal.load ? (
                  <ActivityIndicator
                    size="large"
                    color="black"
                    style={{marginTop: -80}}
                  />
                ) : (
                  <>
                    <Text style={styles.plateNumber}>
                      {modal.data != null ? modal.data.plateNumber : '0000AAA'}
                    </Text>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        onPress={payByModal}
                        style={[styles.miniBtn, {elevation: 3}]}>
                        <Text style={styles.miniBtnTitle}>Төлөх</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.miniBtn} onPress={getCar}>
                        <Text style={{fontSize: 16}}>Дахин шалгах</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
          <Controller
            getCar={getCar}
            onSearch={getCarNumber}
            clearData={() => getCurrentCars()}
            scanBarcode={scanBarcode}
          />
          <CarNumbers navigation={props.navigation} data={data} />
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 10,
    // paddingHorizontal: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  scan: {
    // backgroundColor: 'red',
    alignItems: 'center',
    // height: '20%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ModalContainer: {
    paddingTop: 20,
    zIndex: 100,
    width: 300,
    height: 250,
    // alignSelf: 'space-around',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
  },
  shadow: {
    //flex: 1,
    zIndex: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  plateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttons: {
    paddingHorizontal: 20,
    // backgroundColor: 'purple',
    // flexDirection: 'row',
    width: '100%',
    height: '40%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  miniBtn: {
    backgroundColor: 'white',
    width: 150,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // elevation: 3,
  },
  miniBtnTitle: {
    fontSize: 20,
  },
  close: {
    borderRadius: 20,
    marginRight: 10,
    // backgroundColor: 'red',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 10,
    right: 0,
  },
});
