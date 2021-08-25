import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const CarNumber = (props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        props.navigation.navigate('ShowPayment', {id: props.data.txnId})
      }
      // onPress={() => props.navigation.push('Payment')}
    >
      <Text style={styles.number}>{props.data.plateNumber}</Text>
    </TouchableOpacity>
  );
};

export default CarNumber;

const styles = StyleSheet.create({
  container: {
    width: 130,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    marginVertical: 5,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
