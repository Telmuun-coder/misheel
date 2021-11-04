import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Dimensions,
  Alert,
  BackHandler,
  LogBox
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
import NetInfo from "@react-native-community/netinfo";


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);
  const {PrintDiscount, PayByCard} = NativeModules;
  // const [tolow, setTolow] = useState(null);
  const {state} = useContext(UserState);
  const [modal, setModal] = useState(false);
  const [payType, setPayType] = useState({
    type: 'CASH',
    rrn: '0000000000001',
    invoice: null,
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
            route.params.deleteById();
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
    await AsyncStorage.multiRemove([
      'localState',
      'localInfo',
      'serverInfo',
      'payType',
      'qrState',
    ]);
    console.log('cleared');
    // console.log('checkData:', await AsyncStorage.getItem('payType'));
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
      });
  };

  const checkDiscount = async (qr) => {
    axios.defaults.headers.common = {
      Authorization: `Bearer ${state.token}`,
    };
    await PayByCard.doData();
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
      // setTolow('notNormal');
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
              {
              setLocalState(JSON.parse(e[1])); 
              console.log(e[1]);
              } break;
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
      // setTolow('normal');
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
            console.log(JSON.stringify(res.data.entity));
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

    console.log("customerNo: ", info.register);
    const data = [
      {
        organization_id: state.organization_id, //eniig login hiihed awaad useStore-s awna
        amount: amount,
        vat: vat,
        cashAmount: payType.type == 'CASH' ? amount : '0.00',
        nonCashAmount: payType.type == 'CARD' ? amount : '0.00',
        cityTax: '0.00', //eniig shiideeee
        districtCode: state.parkingList[0].districtCode,
        posNo: '', //
        customerNo: info.type == 'org' ? `${info.register}` : '',
        billType: info.type == 'org' ? '3' : '1',
        billIdSuffix: '',
        returnBillId: '',
        taxType: '1',
        invoiceId: '',//payType.rrn ? payType.rrn : null, //payType.rrn, eniig tolboroo yg tolbog bolgochood holboh
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
            unitPrice: (Math.round((amount / localInfo.totalMinutes) * 100) / 100).toFixed(2),
            vat: (Math.round((amount / 11) * 100) / 100).toFixed(2),
          },
        ],
        // stockGeneretor(121, 5000, 3000, 2000, 1000), //stockGeneretor(localInfo.totalMinutes, 5000, 3000, 2000, 1000),
        bankTransactions: '',
      },
    ];
    AsyncStorage.setItem('eBarimtPostData', JSON.stringify(data));

    console.log('SENDING: ', JSON.stringify(data));
    try {
      setSpin(true);
      let link = config.eBarimtPut;
      link = link.replace(/29/g, '26');
      await PayByCard.doData();
      const res = await axios.post(link, data);
      // const res = await axios.post(`http://172.16.20.26:9000/bill/putArray`, data);
      setSpin(false);

      const obj = fixJson(res.data.outputResultInfoList[0]);
      // console.log(obj);
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
        };
        // console.log('PRINTING: ', JSON.stringify(data));
        
        let eBarimtList = await AsyncStorage.getItem('eBarimtList');
        if(eBarimtList) eBarimtList = JSON.parse(eBarimtList);
        eBarimtList.pop();

        await AsyncStorage.multiRemove(['eBarimtPostData', 'eBarimtList']);
        AsyncStorage.setItem('eBarimtList', JSON.stringify(eBarimtList)); //clear await
        await PrintDiscount.printBarimt(JSON.stringify(printData));


        clearCache();
        route.params.deleteById();
        props.navigation.pop();
      } else {
        //aldaag haruulaad dahin oroldoh bolomj olgohiimu yaahy ahha
        alert('ebarimtPost:', obj.message);
        console.log('EbarinPost', obj);
      }
    } catch (e) {
      console.log('ebarimt post aldaa: ', e);
      alert('НӨАТ баримт хэвлэхэд алдаа гарлаа');
      setSpin(false);
    }
  };

  const doneWithoutEbarimt = () => {
//   console.log(state.organization_id);
    route.params.deleteById();
    clearCache();
    props.navigation.pop();
  }

  const postPaidLocal = async (tmp) => {
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
    await PayByCard.doWifi();
    axios
      .post(config.localIp + ':6080/parking-local/paParkingTxn/paid', data)
      .then(async (res) => {
        if (res.data.message == 'Амжилттай') {
          console.log('localServer: ', res.data.message);
          cacheSteps(5);
          let payTypeTmp = {...payType, isPaid: true};
          setPayType(payTypeTmp);

          let amount = parseInt(localInfo.totalAmount) - parseInt(qrState.amount);
          amount = (Math.round(amount * 100) / 100).toFixed(2);
          const vat = (Math.round((amount / 11) * 100) / 100).toFixed(2);
           
          const barimtData = [
            {
              organization_id: state.organization_id,
              amount: amount,
              vat: vat,
              cashAmount: payType.type == 'CASH' ? amount : '0.00',
              nonCashAmount: payType.type == 'CARD' ? amount : '0.00',
              cityTax: '0.00', 
              districtCode: state.parkingList[0].districtCode,
              posNo: '', 
              customerNo: '',
              billType: `info.type == 'org' ? '3' : '1'`,
              billIdSuffix: '',
              returnBillId: '',
              taxType: '1',
              invoiceId: '',
              reportMount: dateFormat(new Date(), 'yyyy-mm'),
              branchNo: '001', 
              stocks: [
                {
                  barCode: '1',
                  cityTax: '0.00',
                  code: '001',
                  measureUnit: 'Минут',
                  name: 'Зогсоолын төлбөр',
                  qty: (Math.round(localInfo.totalMinutes * 100) / 100).toFixed(2),
                  totalAmount: amount,
                  unitPrice: (Math.round((amount / localInfo.totalMinutes) * 100) / 100).toFixed(2),
                  vat: (Math.round((amount / 11) * 100) / 100).toFixed(2),
                },
              ],
              bankTransactions: '',
            },
          ];

          const element =
            {
              localInfo: {
                downtime: localState.downtime,
                plateNumber: localInfo.plateNumber,
                enterDate: localInfo.enterDate,
                paidAmount: payType.paidAmount,
                txnId: localInfo.localTxnId
              },
              barimtData
            };

          let eBarimtList = await AsyncStorage.getItem('eBarimtList');
          if(eBarimtList) eBarimtList = JSON.parse(eBarimtList);
          else eBarimtList = [];

          eBarimtList.push(element);
          if(eBarimtList.length > 10) eBarimtList.shift();

          const noet = ['eBarimtList', JSON.stringify(eBarimtList)];
          const payingType = ['payType', JSON.stringify(payTypeTmp)];

          console.log("CATCHING DATA: ", JSON.stringify(eBarimtList));

          AsyncStorage.multiSet([noet, payingType]);
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

  const postPaidServer = async (paymentType,res) => {
    const netState = await NetInfo.fetch();
    if(!netState.isConnected) {
      alert('Та 4G сүлжээгээ шалгана уу.');
      return;
    }
    const data = {
      plateNumber: localInfo.plateNumber,
      enterDate: localInfo.enterDate,
      exitDate: `${localInfo.calculatedDate.slice(0,4)}-${localInfo.calculatedDate.slice(4,6)}-${localInfo.calculatedDate.slice(6,8)} ${localInfo.calculatedDate.slice(8,10)}:${localInfo.calculatedDate.slice(10,12)}:${localInfo.calculatedDate.slice(12,14)}`, //yyyy-MM-dd HH:mm:ss  2021 09 02 19 03 27
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
      svRrn: paymentType == 'CARD' ? res ? res.rrn : payType.rrn : null,
      xlsRrn: paymentType == 'CARD' ? res ? res.invoice : payType.invoice : null,
      operDate: dateFormat(new Date(), 'yyyymmddHHMMss'),
      operTerminalType: state.userRole, //userRole-s hamaaruulj haruulnaa
      operUserId: state.userId,
      totalMinutes: localInfo.totalMinutes,
      checksum: localInfo.checksum,
      calculatedDate: localInfo.calculatedDate,
    };
    axios.defaults.headers.common = {
      Authorization: `Bearer ${state.token}`,
    };
    console.log("SERVER PAID: ",data);

    await PayByCard.doData();

    // console.log(config.apiMinu + '/parking/paParkingTxn/paid');
    setSpin(true);
    axios
      .post(config.apiMinu + '/parking/paParkingTxn/paid', data)
      .then(async (res) => {
        // console.log('resposen:', res.data);
        if (res.data.message === 'Амжилттай') {
          console.log('paidServer: ', res.data.message);
          res.data.entity.serverTxnId = res.data.entity.txnId;
          cacheSteps(4);
          cacheData(
            'serverInfo',
            res.data.entity,
            true,
          );

          //serverees irsen res-g stated hadgalah
          setServerInfo(res.data.entity);
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
    // const deleteEbarint = async () => {
    //   await AsyncStorage.removeItem('eBarimtList');
    //   console.log("deleted cache ebarimt list history");
    // };
    // deleteEbarint();

  }, [serverInfo]);

  const payByCash = () => {
    // console.log('payByCash');
    cacheSteps(3);

    postPaidServer('CASH');
    let payTypeTmp = {
      ...payType,
      type: 'CASH',
      rrn: null,
      invoice: null,
      paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
    };
    setPayType(payTypeTmp);
    cacheData('localInfo');
    AsyncStorage.setItem('payType',JSON.stringify(payTypeTmp));
  };

  const payByCard = async () => {

    // NativeModules.PayByCard.pay(`${parseInt(localInfo.totalAmount) - parseInt(qrState.amount)}00`)
    NativeModules.PayByCard.pay('100')
      .then((res) => {
        console.log('hariu2: ', res);
        // {"code": "-22", "description": "Гүйлгээ цуцлагдсан", "invoice": null, "rrn": ""}

        if (res.code == 0) {
          cacheSteps(3);
          postPaidServer('CARD',res);
          let payTypeTmp = {
            ... payType, 
            type: 'CARD',
            rrn: res.rrn ? res.rrn : null,
            invoice: res.invoice ? res.invoice : null,
            paidAmount: parseInt(localInfo.totalAmount) - parseInt(qrState.amount),
          };
          setPayType(payTypeTmp);
          cacheData('localInfo');
          AsyncStorage.setItem('payType', JSON.stringify(payTypeTmp));
        }else{
          alert('Картаар төлөх үед алдаа гарлаа. Та дахин оролдоно уу.');
        }
      })
      .catch((e) => {console.log('cardaar toloh uyd aldaa garlaa', e)});

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

  const backAction = () => {
    console.log("TOLSONUUU:", payType.isPaid);
    if(payType.isPaid) {
      AlertBeforeGoBack();
      console.log("in if");
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress",backAction);
    getPayInfo(route.params.id);
    return () => {
      backHandler.remove();
      clearCache();
    };
  }, [payType.isPaid]);

  // const continueStep = () => {
  //   setTolow('normal');
  //   payStep();
  // }


  const Actions = () => {
    // if(tolow == 'normal')
    return (
      <> 
        {payType.isPaid ? (
          <View style={styles.scan}>
            <Text style={{color: 'green', fontSize: 20, marginBottom: 10}}>
              Амжилттай төлөгдлөө.
            </Text>
            {  state.organization_id
                ? <PayButton red={false} title="Баримт хэвлэх" onPress={() => setModal(true)} />
                : <PayButton red={false} title="БОЛСОН" onPress={doneWithoutEbarimt} /> } 
          </View>
        ) : (
          <>
            <View style={styles.scan}>
              <Text style={{fontFamily: 'RobotoCondensed-Regular'}}>
                Хөнгөлөлтийн хуудас уншуулах:
              </Text>
              <ScannButton onPress={scanBarcode} />
            </View>
            <View style={styles.method}>
              <View style={styles.buttons}>
                {state.userRole === 'POSTPOS' && (  <PayButton red={true} onPress={() => payStep('CASH')}/>)}
                {/* <PayButton red={false} onPress={() => payStep('CARD')} disabled style={{opacity: 0.5}}/> */}
                <PayButton red={false} onPress={() => payStep('CARD')}/>
              </View>
            </View>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <Ebarimt
          showModal={modal}
          printEbarimt={(info) => printEbarimt(info)}
          setShowModal={() => setModal(false)}
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
              {numberWithCommas(qrState.amount)}₮
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}>Төлөх дүн:</Text>
            <Text style={styles.value}>
              {numberWithCommas(parseInt(localInfo.totalAmount) - parseInt(qrState.amount))}₮
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.info}>Төлөгдсөн дүн:</Text>
            <Text style={styles.value}>{numberWithCommas(payType.paidAmount)}₮</Text>
          </View>
        </View>
        <Actions/>
      </View>
      {spin && <Spinner visible={true} />}
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
    elevation: 5,
    paddingVertical: 30,
  },
  info: {
    fontSize: 13,
    fontFamily: 'RobotoCondensed-Regular',
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
    justifyContent: 'flex-end',
  },
  value: {
    // fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'RobotoCondensed-Bold',
  },
  scan: {
    // backgroundColor: 'red',
    alignItems: 'center',
    height: '15%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
