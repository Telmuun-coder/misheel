import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import CarNumber from '../CarNumber';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const CarNumbers = (props) => {

  const Footer = () => (
    <View style={styles.indicator}>
      <ActivityIndicator animating={props.reaching} size={'small'} color={'#000'} />
    </View>
  )
  return (
    <FlatList
      onEndReachedThreshold={0.5}
      onEndReached={props.onEndReached}
      ListHeaderComponent={props.Controller}
      ListFooterComponentStyle={{ width: WINDOWS_WIDTH }}
      ListFooterComponent={() => <Footer />}
      data={props.data}
      style={styles.carNumbers}
      contentContainerStyle={{ justifyContent: 'space-between' }}
      numColumns={2}
      keyExtractor={e => `${e.txnId}${Math.random()}`}
      renderItem={({ item }) => <CarNumber navigation={props.navigation} data={item} deleteById={props.deleteById} />}
    />
  );
};

export default CarNumbers;

const styles = StyleSheet.create({
  carNumbers: {
    //  backgroundColor: 'red',
    width: WINDOWS_WIDTH,
  },
  indicator: {
    height: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent'
  }
});
