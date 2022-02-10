import React, { useContext, useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import CarNumbers from '../../Components/CarNumbers';
import Controller from '../../Components/Controller';
import { UserState } from '../../Context/UserStore';
import Spinner from '../../Components/Spinner';
import config from '../../../config';
import ScannButton from '../../Components/ScannButton';
import dateFormat from 'dateformat';
import { unionBy } from 'lodash';

const { width, height } = Dimensions.get('window');

const Home = (props) => {
  const { PayByCard } = NativeModules;
  const page = useRef(0);
  const getNextPage = useRef(false);
  const searched = useRef(false);
  const [reaching, setReaching] = useState(false);
  const [spin, setSpin] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    load: true,
    data: {},
  });
  const { setStater, state } = useContext(UserState);
  const [data, setData] = useState([]);

  const scanBarcode = () => {
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
    if (number.length < 4)
      Alert.alert(
        'Уучлаарай!',
        'Та хайх дугаараа оруулна уу.',
      );
    else {
      //Keyboard hide
      Keyboard.dismiss();
      axios.defaults.headers.common = { Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz` };
      await PayByCard.doWifi();

      setSpin(true);
      console.log("searching: ", config.localIp + ':6080/parking-local/paParkingTxn/findByPlateNumber?plateNumber=' + number);
      axios.get(config.localIp + ':6080/parking-local/paParkingTxn/findByPlateNumber?plateNumber=' + number)
        .then((res) => {
          setSpin(false);
          if (res.data.message === 'Амжилттай') {
            searched.current = true;
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


  const getCurrentCars = async (noLoading = false) => {
    if (getNextPage.current) return;

    getNextPage.current = true;

    axios.defaults.headers.common = { Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz` };

    try {
      await PayByCard.doWifi();
      !noLoading && setSpin(true);
      noLoading && setReaching(true);
      console.log("calling page: ", page.current);
      axios.get(`${config.localIp}:6080/parking-local/paParkingTxn/currentCars?pageNumber=${page.current}`).then(currentCars => {

        console.log('RES LENGTH:', currentCars.data.entity.length);
        if (currentCars.data.status == '000' && currentCars.data.entity.length > 0) {
          page.current++;
          if (noLoading)
            setData(prev => ([...prev, ...currentCars.data.entity]))
          else setData(currentCars.data.entity);
        }
        setSpin(false);
        setReaching(false);
      });
    } catch (error) {
      console.log('get Current number error', error);
      setSpin(false);
      setReaching(false);
    } finally {
      getNextPage.current = false;
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
      const car = await axios.get(`${config.localIp}:6080/parking-local/paParkingTxn/latestReadPlate`);
      if (car.data.status == '000') {
        console.log('Current Car: ', car.data);
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

  const ebarimtTurnOn = async () => {
    let link = config.send;
    link = link.replace(/29/g, '26');
    const eBarimt = await AsyncStorage.getItem('isCalled');
    if (dateFormat(new Date(eBarimt), 'yyyy-mm-dd') == dateFormat(new Date(), 'yyyy-mm-dd')) return;

    await PayByCard.doData();
    axios.get(link + state.organization_id, { headers: { Authorization: null } })
      .then((res) => {
        // res.data.success
        console.log("e barimt send: ", res.data);
        AsyncStorage.setItem('isCalled', dateFormat(new Date(), 'yyyy-mm-dd'));
      })
      .catch((e) => console.log('3n honogt 1', e));
  };

  useEffect(() => {

    const checkCache = async () => {
      let keys = await AsyncStorage.getAllKeys();
      keys = keys.filter(e => (e != 'simType' && e != 'localId' && e != 'isCalled' && e != 'eBarimtList' && e != 'username'));
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
                props.navigation.navigate('ShowPayment', { id: null, deleteById: () => deleteById(0) });
              },
            },
          ],
          { cancelable: false },
        );
      if (keys.length > 1) {
        AlertBeforeGoBack();
      }
    };
    checkCache();
    getCurrentCars();
    ebarimtTurnOn();
  }, []);

  const getExiting = async (platenumber) => {
    axios.defaults.headers.common = {
      Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
    };

    await PayByCard.doWifi();

    setSpin(true);
    axios.get(config.localIp + ':6080/parking-local/paParkingTxn/findByPlateNumber?plateNumber=' + platenumber)
      .then((res) => {
        setSpin(false);
        if (res.data.message === 'Амжилттай') {
          props.navigation.navigate('ShowPayment', { id: res.data.entity[0].txnId, deleteById: () => deleteById(res.data.entity[0].txnId) });
        } else {
          alert(res.data.message);
        }
      })
      .catch((e) => {
        console.log('getExiting aldaa', e.message);
        setSpin(false);
        alert(e.message);
      });
  }

  const payByModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
    getExiting(modal.data.plateNumber);
  };

  const deleteById = (id) => {
    setData(prev => (prev.filter(e => e.txnId != id)));
  }

  const nextPage = () => {
    // console.log("NEXT2");
    if (!searched.current) {
      // console.log('calling next page')
      getCurrentCars(true);
    }
  }

  return (
    <View style={styles.container}>

      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      {/* <Controller
        getCar={getCar}
        onSearch={getCarNumber}
        clearData={() => {page.current = 0; searched.current = false; getCurrentCars(false)}}
        scanBarcode={scanBarcode}
      /> */}

      <CarNumbers
        Controller={() => (
          <Controller
            getCar={getCar}
            onSearch={getCarNumber}
            clearData={() => { page.current = 0; searched.current = false; getCurrentCars(false) }}
            scanBarcode={scanBarcode}
          />)}
        navigation={props.navigation}
        data={data}
        deleteById={deleteById}
        onEndReached={nextPage}
        reaching={reaching}
      />

      <Modal animationType="fade" transparent={true} visible={modal.visible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={() => setModal((prev) => ({ ...prev, visible: false }))}>
            <View style={styles.shadow}>

              {/* <View
            style={styles.shadow}
            onStartShouldSetResponder={() =>
              setModal((prev) => ({...prev, visible: false}))
            }
          /> */}

              <View style={styles.ModalContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.close}
                  onPress={() => setModal((prev) => ({ ...prev, visible: false }))}>
                  <Icon name="ios-close" size={30} color="#7E7E7E" />
                </TouchableOpacity>
                <Text>Гарах машины дугаар:</Text>
                {modal.load ? (
                  <ActivityIndicator
                    size="large"
                    color="black"
                    style={{ marginTop: -80 }}
                  />
                ) : (
                  <>
                    <Text style={styles.plateNumber}>
                      {modal.data != null ? modal.data.plateNumber : '0000AAA'}
                    </Text>
                    <View style={styles.buttons}>
                      <TouchableOpacity
                        disabled={modal.data == null}
                        onPress={payByModal}
                        style={[styles.miniBtn, { elevation: 3 }, modal.data == null && { opacity: 0.5 }]}>
                        <Text style={styles.miniBtnTitle}>Төлөх</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.miniBtn} onPress={getCar}>
                        <Text style={{ fontSize: 16 }}>Дахин шалгах</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      <Spinner visible={spin} />
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
    elevation: 3,
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
    justifyContent: 'center',
    alignItems: 'center'
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
