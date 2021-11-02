import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../../Components/Button';
import PayButton from '../../Components/PayButton';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

const Printer = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                <Text style={styles.info}>Зогссон хугацаа:</Text>
                <Text style={styles.value}> 30min
                {/* {localState.downtime} */}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.info}>Тээврийн хэрэгслийн дугаар: </Text>
                <Text style={styles.value}>
                8989AAA
                {/* {localInfo.plateNumber} */}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.info}>Нэвтэрсэн хугацаа:</Text>
                <Text style={styles.value}>
                {/* {localInfo.enterDate} */}
                2021-01-01 01:01:01
                </Text>
            </View>

            {/* <View style={styles.row}>
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
            </View> */}
            <View style={styles.row}>
                <Text style={styles.info}>Төлөгдсөн дүн:</Text>
                <Text style={styles.value}>{numberWithCommas(1000)}₮</Text>
            </View>
            </View>
            <View style={styles.buttons}>
                <PayButton red={false} title="Баримт хэвлэх" 
                    // onPress={() => setModal((prev) => ({...prev, show: true}))} 
                />
            </View>
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
