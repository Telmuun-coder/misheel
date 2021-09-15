import React from 'react';
import {StyleSheet, ScrollView, View, Dimensions, FlatList, ActivityIndicator} from 'react-native';
import CarNumber from '../CarNumber';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const CarNumbers = (props) => {
  return (
    <>
    <FlatList
      onEndReachedThreshold={0.1}
      onEndReached={props.onEndReached}
      data={props.data}
      style={styles.carNumbers}
      contentContainerStyle={{justifyContent: 'space-between'}}
      numColumns={2}
      keyExtractor={e => `${e.txnId}${Math.random()}`}
      renderItem={({item}) => <CarNumber navigation={props.navigation} data={item} deleteById={props.deleteById}/>}
    />
    <View style={styles.indicator}>
      <ActivityIndicator animating={props.reaching} size={'small'} color={'#000'}/>
    </View>
    </>
  );
};

export default CarNumbers;

const styles = StyleSheet.create({
  carNumbers: {
  //  backgroundColor: 'red',
    width: WINDOWS_WIDTH * 0.9,
  },
  indicator: {
    height: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent'
  }
});
