import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, NativeModules } from 'react-native';
import Button from '../../Components/Button';
import PayButton from '../../Components/PayButton';
import { useRoute } from '@react-navigation/native';
import EbarimtModal from '../../Components/EbarimtModal';
import axios from 'axios';
import config from '../../../config';
import { fixJson } from '../../../help';
import AsyncStorage from '@react-native-community/async-storage';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

const Printer = ({navigation}) => {
    const route = useRoute();
    const [state, setState] = useState({});
    const [modal, setModal] = useState(false);
    const [spin, setSpin] = useState(false);
    const {PrintDiscount, PayByCard} = NativeModules;

    useEffect(() => {
    //    console.log(route.params.data);
       setState(route.params.data);
    }, []);

    const printEbarimt = async (info) => {

        const data = [{
            ...state.barimtData[0],
            billType: info.type == 'org' ? '3' : '1',
            customerNo: info.type == 'org' ? `${info.register}` : ''
        }];

        await PayByCard.doData();
        try {
          setSpin(true);
          let link = config.eBarimtPut;
          link = link.replace(/29/g, '26');
          await PayByCard.doData();
          console.log(data);
          const res = await axios.post(link, data);
          // const res = await axios.post(`http://172.16.20.26:9000/bill/putArray`, data);
          setSpin(false);
          const obj = fixJson(res.data.outputResultInfoList[0]);
          if (obj.success) {
            const printData = {
              ebarimt: {
                billId: obj.billId,
                date: obj.date,
                registerNo: '',
                time: state.localInfo.downtime,
                amount: obj.amount,
                lottery: obj.lottery,
                qrData: obj.qrData,
                tax: obj.vat,
              },
            };
            // console.log('PRINTING: ', JSON.stringify(data));
            
            let eBarimtList = await AsyncStorage.getItem('eBarimtList');
            if(eBarimtList) {
                eBarimtList = JSON.parse(eBarimtList);
                eBarimtList = eBarimtList.filter(e => e.localInfo.txnId != state.localInfo.txnId);
            }
    
            await AsyncStorage.removeItem('eBarimtList');
            AsyncStorage.setItem('eBarimtList', JSON.stringify(eBarimtList)); //clear await
            await PrintDiscount.printBarimt(JSON.stringify(printData));    
            // clearCache();
            // route.params.deleteById();
            navigation.goBack();
          } else {
            //aldaag haruulaad dahin oroldoh bolomj olgohiimu yaahy ahha
            alert('ebarimtPost:', obj.message);
            console.log('EbarinPost', obj);
          }
        } catch (e) {
          console.log('ebarimt post aldaa: ', e);
          alert('НӨАТ баримт хэвлэхэд алдаа гарлаа');
        //   setSpin(false);
        }
      };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                <Text style={styles.info}>Зогссон хугацаа:</Text>
                <Text style={styles.value}> 
                    {state.localInfo?.downtime}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.info}>Тээврийн хэрэгслийн дугаар: </Text>
                <Text style={styles.value}>
                {state.localInfo?.plateNumber}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.info}>Нэвтэрсэн хугацаа:</Text>
                <Text style={styles.value}>
                    {state.localInfo?.enterDate}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.info}>Төлөгдсөн дүн:</Text>
                <Text style={styles.value}>{state.localInfo ? numberWithCommas(state.localInfo.paidAmount) : 0}₮</Text>
            </View>
            </View>
            <View style={styles.buttons}>
                <PayButton red={false} title="Баримт хэвлэх" onPress={() => setModal(true)} />
            </View>

            <EbarimtModal
                showModal={modal}
                printEbarimt={(info) => printEbarimt(info)}
                setShowModal={() => setModal(false)}
            />
        </View>
    )
}

export default Printer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: '100%',
        height: '30%',
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
      value: {
        // fontWeight: 'bold',
        fontSize: 13,
        fontFamily: 'RobotoCondensed-Bold',
      },
      buttons: {
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20
      }
})
