import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const PayButton = ({red, style, title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, !red && {backgroundColor: 'black'}, style]}>
      <Text style={styles.text}>
        {title ? title : red ? `БЭЛЭН МӨНГӨ` : `БАНКНЫ КАРТ`}
      </Text>
    </TouchableOpacity>
  );
};

export default PayButton;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D81E21',
    elevation: 5,
  },
  text: {
    color: '#FEFDFF',
    fontFamily: 'RobotoCondensed-Regular',
  },
});
