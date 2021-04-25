import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Dimensions,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import dateFormat from 'dateformat';
import {UserState} from '../../Context/UserStore';
import PayButton from '../../Components/PayButton';
import ScannButton from '../../Components/ScannButton';
import Spinner from '../../Components/Spinner';
import Ebarimt from '../../Components/EbarimtModal';
import Header from '../../Components/Header';

import {
  stockGeneretor,
  fixJson,
  convertMinuteToTime,
  fixQR,
} from '../../../help';
import config from '../../../config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShowPayment = (props) => {
  const {PrintDiscount, PayByCard} = NativeModules;
  const {state} = useContext(UserState);
  const [modal, setModal] = useState({
    show: false,
  });
  const [payType, setPayType] = useState({
    type: 'CASH',
    rrn: '0000000000001',
    paidAmount: 0,
    isPaid: false,
  });
  const [spin, setSpin] = useState(true);
  const [qrState, setQrState] = useState({
    qrCode: null,
    amount: 0,
    parkingId: null,
    paMerchant: {
      merchantId: null,
      merchantName: null,
    },
    expireDate: null,
    txnId: null,
  });
  const [localState, setLocalState] = useState({
    //Component-н state болгож ашиглана.
    steps: [],
    downtime: '0 мин',
  });
  const [localInfo, setLocalInfo] = useState({
    //local server-с мэдээллүүдийг энэ хадгалж хэрэглэнэ.
    success: false,
    localTxnId: null,
    plateNumber: null,
    enterDate: null,
    exitDate: null,
    createdDate: null,
    totalAmount: 0,
  });
  const [serverInfo, setServerInfo] = useState({
    //Server-с мэдээллүүдийг энэ хадгалж хэрэглэнэ.
    paidDate: null,
    serverTxnId: null,
  });
  const route = useRoute();
  const AlertBeforeGoBack = () =>
    Alert.alert(
      'Анхаар!',
      'Та баримт хэвлэхгүй гарах уу.',
      [
        {
          text: 'ҮГҮЙ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'ТИЙМ',
          onPress: () => {
            clearCache();
            props.navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );

  const cacheSteps = async (step) => {
    // 2 5 4 3
    let tmpSteps = localState;
    tmpSteps.steps.push(step);
    setLocalState({...tmpSteps});
    await AsyncStorage.setItem('localState', JSON.stringify(tmpSteps));
    // console.log('steps:', await AsyncStorage.getItem('localState'));
  };

  const cacheData = async (name, data, wait = false) => {
    // console.log('payType:', payType);
    // await AsyncStorage.setItem('payType', JSON.stringify(payType));
    if (name === 'localInfo')
      AsyncStorage.setItem('localInfo', JSON.stringify(localInfo));
    else if (wait) await AsyncStorage.setItem(name, JSON.stringify(data));
    else AsyncStorage.setItem(name, JSON.stringify(data));
  };

  const clearCache = async () => {
    console.log('clearing cache');
    // let tmpSteps = localState;
    // tmpSteps.steps[(1, 3, 4)];
    // // setLocalState({...tmpSteps});
    // await AsyncStorage.setItem('localState', JSON.stringify(tmpSteps));
    // let tmpPaytype = payType;
    // tmpPaytype.isPaid = false;
    // await AsyncStorage.setItem('payType', JSON.stringify(tmpPaytype));

    await AsyncStorage.multiRemove([
      'localState',
      'localInfo',
      'serverInfo',
      'payType',
      'qrState',
    ]);
    console.log('cleared');
    console.log('checkData:', await AsyncStorage.getItem('payType'));
  };

  const scanBarcode = (props) => {
    NativeModules.BarcodeModule.init()
      .then(() => {
        NativeModules.BarcodeModule.scan()
          .then((code) => checkDiscount(code))
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
    PayByCard.doData();
    setQrState((prev) => ({...prev, qrcode: qr}));

    setSpin(true);
    axios
      .post(config.apiMinu + '/parking/paMerchant/checkQr', {
        //192.168.160.29:8765
        qrCode: qr.indexOf('000026') == 1 ? qr.slice(7, qr.length - 1) : qr,
        parkingId: state.parkingId,
      })
      .then((res) => {
        setSpin(false);
        if (res.data.message === 'Амжилттай') {
          cacheSteps(2);
          cacheData('qrState', {...res.data.entity});
          // AsyncStorage.setItem(
          //   'qrState',
          //   JSON.stringify({...qrState, ...res.data.entity}),
          // );

          setQrState((prev) => ({
            ...prev,
            ...res.data.entity,
          }));
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

  const getPayInfo = async (txnId) => {
    if (!txnId) {
      const cache = await AsyncStorage.multiGet([
        'localState',
        'localInfo',
        'serverInfo',
        'payType',
        'qrState',
      ]);
      // console.log('cached keys: ', cache);
      // console.log(await AsyncStorage.getItem('payType'));
      cache.forEach((e) => {
        if (e[1])
          switch (e[0]) {
            case 'localState':
              setLocalState(JSON.parse(e[1]));
              break;
            case 'qrState':
              setQrState(JSON.parse(e[1]));
              break;
            case 'payType':
              setPayType(JSON.parse(e[1]));
              break;
            case 'serverInfo':
              setServerInfo(JSON.parse(e[1]));
              break;
            case 'localInfo':
              setLocalInfo(JSON.parse(e[1]));
              break;
            default:
              break;
          }
      });
      setSpin(false);
      return;
    } else {
      axios.defaults.headers.common = {
        Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
      };
      PayByCard.doWifi();
      axios
        .get(
          config.localIp + ':6080/parking-local/paParkingTxn/findById/' + txnId,
        )
        .then((res) => {
          setSpin(false);
          if (res.data.message === 'Амжилттай') {
            setLocalState((prev) => ({
              ...prev,
              steps: [1],
              downtime: convertMinuteToTime(res.data.entity.totalMinutes),
            }));
            setLocalInfo({
              localTxnId: res.data.entity.txnId,
              plateNumber: res.data.entity.plateNumber,
              enterDate: res.data.entity.enterDate,
              createdDate: res.data.entity.createdDate,
              totalAmount: res.data.entity.totalAmount,
              totalMinutes: res.data.entity.totalMinutes,
              checksum: res.data.entity.checksum,
              calculatedDate: res.data.entity.calculatedDate,
            });
          }
        })
        .catch((e) => {
          console.log('getCarNumber aldaa', e.message);
          setSpin(false);
        });
    }
  };

  const printEbarimt = async (info) => {
    let amount = parseInt(localInfo.totalAmount) - parseInt(qrState.amount);
    amount = (Math.round(amount * 100) / 100).toFixed(2);
    const vat = (Math.round((amount / 11) * 100) / 100).toFixed(2);
    console.log('DISCTRICT CODE: ', state.parkingList[0].districtCode);
    const data = [
      {
        organization_id: 29, //eniig login hiihed awaad useStore-s awna
        amount: amount,
        vat: vat,
        cashAmount: payType.type == 'CASH' ? amount : '0.00',
        nonCashAmount: payType.type == 'CARD' ? amount : '0.00',
        cityTax: '0.00', //eniig shiideeee
        districtCode: state.parkingList[0].districtCode,
        posNo: '', //
        customerNo: info.register,
        billType: '1',
        billIdSuffix: '',
        returnBillId: '',
        taxType: '1',
        invoiceId: '', //payType.rrn, eniig tolboroo yg tolbog bolgochood holboh
        reportMount: dateFormat(new Date(), 'yyyy-mm'),
        branchNo: '001', //back-endes l awah bhda
        stocks: [
          {
            barCode: '1',
            cityTax: '0.00',
            code: '001',
            measureUnit: 'Минут',
            name: 'Зогсоолын төлбөр',
            qty: (Math.round(localInfo.totalMinutes * 100) / 100).toFixed(2),
            totalAmount: amount,
            unitPrice: (
              Math.round((amount / localInfo.totalMinutes) * 100) / 100
            ).toFixed(2),
            vat: (Math.round((amount / 11) * 100) / 100).toFixed(2),
          },
        ],
        // stockGeneretor(121, 5000, 3000, 2000, 1000), //stockGeneretor(localInfo.totalMinutes, 5000, 3000, 2000, 1000),
        bankTransactions: '',
      },
    ];
    AsyncStorage.setItem('eBarimtPostData', JSON.stringify(data));

    // console.log('eBARIMT minut: ', localInfo.totalMinutes);
    try {
      setSpin(true);
      PayByCard.doData();
      const res = await axios.post(config.eBarimtPut, data);
      setSpin(false);

      const obj = fixJson(res.data.outputResultInfoList[0]);
      if (obj.success) {
        const printData = {
          ebarimt: {
            billId: obj.billId,
            date: obj.date,
            registerNo: '',
            time: localInfo.totalMinutes,
            amount: obj.amount,
            lottery: obj.lottery,
            qrData: obj.qrData,
            tax: obj.vat,
          },
          tbarimt: {
            plateNumber: localInfo.plateNumber,
            amount: obj.amount,
            date: obj.date,
            qrData: serverInfo.paymentQr,
          },
        };
        AsyncStorage.removeItem('eBarimtPostData');
        // AsyncStorage.setItem('eBarimtPrintData', JSON.stringify(printData));
        //Hevleh Native module aa duudnaa
        await PrintDiscount.printBarimt(JSON.stringify(printData));
        clearCache();
        props.navigation.pop();
      } else {
        //aldaag haruulaad dahin oroldoh bolomj olgohiimu yaahy ahha
        alert('ebarimtPost:', obj.message);
        console.log('EbarinPost', obj);
      }
    } catch (e) {
      console.log('ebarimt post aldaa: ', e);
      setSpin(false);
    }
  };

  const postPaidLocal = (tmp) => {
    const data = {
      calculatedDate: localInfo.calculatedDate,
      checksum: localInfo.checksum,
      createdDate: serverInfo.createdDate,
      discountAmount: qrState.amount,
      enterDate: serverInfo.enterDate,
      exitDate: serverInfo.exitDate,
      operDate: serverInfo.operDate,
      operTerminalType: serverInfo.operTerminalType,
      operUserId: serverInfo.operUserId,
      paidAmount: serverInfo.paidAmount,
      paidDate: serverInfo.paidDate,
      paymentType: serverInfo.paymentType,
      plateNumber: localInfo.plateNumber,
      qrCode: qrState.qrCode,
      qrCodeAmount: qrState.amount + '',
      qrCodeMerchantId: qrState.paMerchant.merchantId,
      qrCodeParkingId: qrState.parkingId,
      qrCodeTxnId: qrState.txnId,
      qrCodeValidDate: qrState.expireDate,
      serverParkingId: null, //asuuh
      serverTxnId: serverInfo.serverTxnId,
      serverUserId: null, //asuuh
      statusCode: serverInfo.statusCode,
      statusMessage: serverInfo.statusMessage,
      totalAmount: serverInfo.totalAmount,
      totalMinutes: localInfo.totalMinutes,
      txnId: localInfo.localTxnId,
      svRrn: serverInfo.svRrn,
      xlsRrn: serverInfo.xlsRrn,
    };
    axios.defaults.headers.common = {
      Authorization: `Basic MTE0MDA1ODI2MzoxMTQwMDU4MjYz`,
    };
    PayByCard.doWifi();
    axios
      .post(config.localIp + ':6080/parking-local/paParkingTxn/paid', data)
      .then((res) => {
        if (res.data.message == 'Амжилттай') {
          console.log('localServer: ', res.data.message);
          cacheSteps(5);
          setPayType((prev) => ({
            ...prev,
            isPaid: true,
            // paidAmount: serverInfo.paidAmount,
          }));
          AsyncStorage.setItem(
            'payType',
            JSON.stringify({...payType, isPaid: true}),
          );
          // clearCache();
          setSpin(false);
        } else {
          setSpin(false);
          alert('LoadPaid: ' + res.data.message + '. Та дахин оролдоно уу.');
        }
      })
      .catch((e) => {
        setSpin(false);
        alert('Local service connection error');
        console.log('locald medegdeh uyd aldaa garaash', e);
      });
  };

  const postPaidServer = (paymentType) => {
    const data = {
      plateNumber: localInfo.plateNumber,
      enterDate: localInfo.enterDate,
      exitDate: null,
      totalAmount: localInfo.totalAmount,
      discountAmount: qrState.amount,
      paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
      paymentType: paymentType, // 'CARD', //
      statusCode: '000',
      statusMessage: 'SUCCESS',
      userId: state.userId,
      parkingId: state.parkingId,
      serverTxnId: null,
      //-------QR code-------------------
      qrCode: qrState.qrCode,
      qrCodeTxnId: qrState.txnId,
      qrCodeValidDate: qrState.expireDate,
      qrCodeAmount: qrState.amount,
      qrCodeMerchantId: qrState.paMerchant.merchantId,
      qrCodeParkingId: qrState.parkingId,
      //----------------------------------
      svRrn: '000000000001', //params.invoice cardar tolson bol
      xlsRrn: '0000000000002', //params.rrn //redpointoor tolson bol
      operDate: dateFormat(new Date(), 'yyyymmddHHMMss'),
      operTerminalType: 'POSTPOS', //userRole-s hamaaruulj haruulnaa
      operUserId: state.userId,
      totalMinutes: localInfo.totalMinutes,
      checksum: localInfo.checksum,
      calculatedDate: localInfo.calculatedDate,
    };
    axios.defaults.headers.common = {
      Authorization: `Bearer ${state.token}`,
    };

    PayByCard.doData();

    setSpin(true);
    axios
      .post(config.apiMinu + '/parking/paParkingTxn/paid', data)
      .then(async (res) => {
        // console.log('resposen:', res.data);
        if (res.data.message === 'Амжилттай') {
          console.log('paidServer: ', res.data.message);
          cacheSteps(4);
          cacheData(
            'serverInfo',
            {
              ...res.data.entity,
              serverTxnId: res.data.entity.txnId,
            },
            true,
          );

          // await AsyncStorage.setItem(
          //   'serverInfo',
          //   JSON.stringify({
          //     ...res.data.entity,
          //     serverTxnId: res.data.entity.txnId,
          //   }),
          // );

          //serverees irsen res-g stated hadgalah
          setServerInfo({
            ...res.data.entity,
            serverTxnId: res.data.entity.txnId,
          });
          //server-es irsen res-g locald medegdeh funtion-g duudah
          // postPaidLocal({
          //   ...res.data.entity,
          //   serverTxnId: res.data.entity.txnId,
          //   paymentType: paymentType,
          // });
        } else {
          alert('Server paid: ' + res.data.message);
          setSpin(false);
        }
      })
      .catch((e) => {
        console.log('paidToServer aldaa:', e);
        setSpin(false);
      });
  };

  useEffect(() => {
    localState.steps[localState.steps.length - 1] == 4 && postPaidLocal();
  }, [serverInfo]);

  const payByCash = () => {
    // console.log('payByCash');
    cacheSteps(3);

    postPaidServer('CASH');
    setPayType((prev) => ({
      ...prev,
      type: 'CASH',
      rrn: '',
      // isPaid: true,
      paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
    }));
    cacheData('localInfo');
    AsyncStorage.setItem(
      'payType',
      JSON.stringify({
        ...payType,
        type: 'CASH',
        rrn: '',
        paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
      }),
    );
  };

  const payByCard = () => {
    // NativeModules.PayByCard.pay(localInfo.totalAmount + '');
    // svRrn: '000000000001', //params.invoice
    // xlsRrn: '0000000000002', //params.rrn

    // cacheSteps(3);
    // postPaidServer('CARD');
    // setPayType((prev) => ({
    //   ...prev,
    //   type: 'CARD',
    //   rrn: '0000000000001',
    //   // isPaid: true,
    //   paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
    // }));
    // cacheData('localInfo');
    // AsyncStorage.setItem(
    //   'payType',
    //   JSON.stringify({
    //     ...payType,
    //     type: 'CARD',
    //     rrn: '0000000000001',
    //     paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
    //   }),
    // );

    // parseInt(localInfo.totalAmount) - parseInt(qrState.amount) + '';

    // ---------------------------------------------------------------------------------
    // NativeModules.PayByCard.pay('100') .then(
    const paidTest = (res) => {
      // console.log('hariu2: ', res);
      // if (res.code == 0) {
      if (true) {
        cacheSteps(3);
        postPaidServer('CARD');
        setPayType((prev) => ({
          ...prev,
          type: 'CARD',
          rrn: '0000000000001',
          invoice: '0000000000001',
          // isPaid: true,
          paidAmount:
            parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
        }));
        cacheData('localInfo');
        AsyncStorage.setItem(
          'payType',
          JSON.stringify({
            ...payType,
            type: 'CARD',
            rrn: '0000000000001',
            paidAmount:
              parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
          }),
        );
      }
    };
    paidTest();
    // ).catch((e) => console.log('cardaar toloh uyd aldaa garlaa', e));
  };
  const payDef = (type) => {
    if (type === 'CASH') payByCash();
    else payByCard();
  };

  const payStep = (type) => {
    switch (localState.steps[localState.steps.length - 1]) {
      case 3:
        postPaidServer(payType.type);
        break;
      case 4:
        postPaidLocal();
        break;
      // case 5: //togdtson
      //   break;
      // case 6:
      //   break;
      default:
        payDef(type);
        break;
    }
  };

  useEffect(() => {
    getPayInfo(route.params.id);
    return () => {
      console.log('COMPONENT UNMOUNT CALLING!!!!!!!!');
      clearCache();
    };
  }, []);

  return (
    <>
      {spin && <Spinner visible={true} />}
      <View style={styles.container}>
        <Ebarimt
          showModal={modal.show}
          printEbarimt={(info) => printEbarimt(info)}
          setShowModal={(modal) => setModal((prev) => ({...prev, ...modal}))}
        />
        <Header
          title="Төлбөр төлөх"
          callback={() => {
            payType.isPaid ? AlertBeforeGoBack() : props.navigation.goBack();
          }}
        />
        <Text style={styles.name}>{state.parkingList[0].parkingName}</Text>

        <View style={styles.infos}>
          <View style={styles.row}>
            <Text style={styles.info}>Зогссон хугацаа:</Text>
            <Text style={styles.value}>{localState.downtime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.info}>Тээврийн хэрэгслийн дугаар: </Text>
            <Text style={styles.value}>{localInfo.plateNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}>Нэвтэрсэн хугацаа:</Text>
            <Text style={styles.value}>{localInfo.enterDate}</Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.info}>Гарсан хугацаа:</Text>
            <Text style={styles.value}>{localInfo.exitDate}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.info}>Хөнгөлсөн дүн:</Text>
            <Text style={[styles.value, {color: 'green'}]}>
              {qrState.amount}₮
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}>Төлөх дүн:</Text>
            <Text style={styles.value}>
              {parseInt(localInfo.totalAmount) - parseInt(qrState.amount)}₮
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}>Төлөгдсөн дүн:</Text>
            <Text style={styles.value}>{payType.paidAmount}₮</Text>
          </View>
        </View>
        {payType.isPaid ? (
          <View style={styles.scan}>
            <Text style={{color: 'green', fontSize: 20, marginBottom: 10}}>
              Амжилттай төлөгдлөө.
            </Text>
            <Text>Баримт хэвлэх:</Text>
            <PayButton
              red={false}
              title="ХЭВЛЭ"
              onPress={() => setModal((prev) => ({...prev, show: true}))}
            />
          </View>
        ) : (
          <>
            <View style={styles.scan}>
              <Text>Хөнгөлөлтийн хуудас уншуулах:</Text>
              <ScannButton onPress={scanBarcode} />
            </View>
            <View style={styles.method}>
              <Text style={{fontSize: 18}}>Төлбөр төлөх арга:</Text>
              <View style={styles.buttons}>
                {state.userRole === 'POSTPOS' && (
                  <PayButton
                    red={true}
                    onPress={() =>
                      // payByCash()
                      payStep('CASH')
                    }
                  />
                )}
                <PayButton
                  red={false}
                  onPress={() =>
                    // payByCard()
                    payStep('CARD')
                  }
                  // onPress={() => setModal((prev) => ({...prev, show: true}))}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default ShowPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    // paddingVertical: 30,
    paddingTop: 0,
    paddingBottom: 40,
    zIndex: 1,
    // backgroundColor: 'gray'
  },
  buttons: {
    flexDirection: 'row',
    width: windowWidth,
    justifyContent: 'space-around',
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 25,
    alignSelf: 'center',
  },
  infos: {
    // backgroundColor: 'blue',
    width: '100%',
    height: '45%',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    paddingVertical: 30,
  },
  info: {
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  method: {
    alignItems: 'center',
    height: '15%',
    // backgroundColor: 'pink',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  scan: {
    // backgroundColor: 'red',
    alignItems: 'center',
    height: '15%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
