import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const { width, height } = Dimensions.get('window');

const Item = ({item, navigation}) => {
    return(
        <TouchableHighlight onPress={() => navigation.navigate('Printer')} activeOpacity={0.7} underlayColor={'#707070'}>
            <View style={styles.item}>
                <Text style={styles.itemNumber}>8989УБА</Text>
                <Icon name="chevron-thin-right" color="#707070" size={30}/>
            </View>
        </TouchableHighlight>
    )
}

const EbarimtList = ({navigation}) => {
    const [list, setList] = useState([1,2,3,4,5,6,7,8,9,10]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Хадгалсан баримтууд</Text>
            <FlatList
                data={list}
                style={styles.items}
                keyExtractor={e => e+''}
                renderItem={({item}) => <Item data={item} navigation={navigation}/>}
            />
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
    }
})
