import React from 'react';
import {StyleSheet, ScrollView, View, Dimensions} from 'react-native';
import CarNumber from '../CarNumber';

const WINDOWS_WIDTH = Dimensions.get('window').width;
const WINDOWS_HEIGHT = Dimensions.get('window').height;

const CarNumbers = (props) => {
  const cars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow',
      }}>
      <View style={styles.carNumbers}>
        {props.data.map((e, i) => (
          <CarNumber navigation={props.navigation} data={e} key={i} />
        ))}
      </View>
    </ScrollView>
  );
};

export default CarNumbers;

const styles = StyleSheet.create({
  carNumbers: {
    // width: '95%',
    // width: '90%',
    width: WINDOWS_WIDTH * 0.9,
    // height: 500,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingHorizontal: 25,
  },
});
