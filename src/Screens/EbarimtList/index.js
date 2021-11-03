import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');

const Item = ({data, navigation}) => {
    return(
        <TouchableHighlight onPress={() => navigation.navigate('Printer',{data})} activeOpacity={0.7} underlayColor={'#707070'}>
            <View style={styles.item}>
                <Text style={styles.itemNumber}>{data.localInfo.plateNumber}</Text>
                <Icon name="chevron-thin-right" color="#707070" size={30}/>
            </View>
        </TouchableHighlight>
    )
}

const EbarimtList = ({navigation}) => {
    const [list, setList] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(()=>{
        const readData = async () => {
            let eBarimt = await AsyncStorage.getItem("eBarimtList");
            // let eBarimt = await AsyncStorage.removeItem("eBarimtList");
            if(eBarimt) eBarimt = JSON.parse(eBarimt);
            else eBarimt = [];

            console.log("reading");
            

            setList(eBarimt);
            setLoader(false);
        };
        readData();
        const willFocusSubscription = navigation.addListener('focus', () => readData());

        return willFocusSubscription;
    },[]);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Хадгалсан баримтууд</Text>
            {loader 
            ?   <ActivityIndicator color={'#000'} size='large' animating/>
            :   <FlatList
                    data={list}
                    style={styles.items}
                    keyExtractor={e => e.localInfo.txnId}
                    ListEmptyComponent={() => <Text style={styles.emptyText}>Автоматаар хадгалсан баримт одоогоор байхгүй байна.</Text>}
                    renderItem={({item}) => <Item data={item} navigation={navigation}/>}
                />}
        </View>
    )
}

export default EbarimtList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold', 
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 10
    },
    items: {
        alignSelf: 'center',
        width: '100%',
    },
    item: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F3F2',
        paddingLeft: 20,
        paddingRight: 10,
        backgroundColor: '#FFF',
    },
    itemNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e2e2e'
    },
    emptyText: {
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 16,
        color: '#707070'
    }
})
