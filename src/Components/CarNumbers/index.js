import React from 'react';
import {StyleSheet, ScrollView, View, Dimensions, FlatList} from 'react-native';
import CarNumber from '../CarNumber';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const CarNumbers = (props) => {
  return (
    <FlatList
      onEndReachedThreshold={0.1}
      onEndReached={props.onEndReached}
      data={props.data}
      style={styles.carNumbers}
      contentContainerStyle={{justifyContent: 'space-between'}}
      numColumns={2}
      keyExtractor={e => e.txnId}
      renderItem={({item}) => <CarNumber navigation={props.navigation} data={item} deleteById={props.deleteById}/>}
    />
  );
};

export default CarNumbers;

const styles = StyleSheet.create({
  carNumbers: {
  //  backgroundColor: 'red',
    width: WINDOWS_WIDTH * 0.9,
  },
});
