import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Number from '../Number';
import Numbers from '../Numbers';
import Button from '../Button';
import ScannButton from '../ScannButton';
import { UserState } from '../../Context/UserStore';

const { width, height } = Dimensions.get('window');

const Controller = (props) => {
  const inputRef = useRef(null);
  const { state } = useContext(UserState);
  const [selectedValue, setSelectedValue] = useState('0000');
  const isFocused = useIsFocused();
  const clear = () => {
    setSelectedValue('0000');
    props.clearData();
  };
  useEffect(() => {
    setSelectedValue('0000');
    return () => setSelectedValue('0000');
  }, [isFocused]);

  return (
    <View style={[styles.numbers, state.userRole === 'SELFPOS' && { paddingHorizontal: '10%' }]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        keyboardType="number-pad"
        maxLength={4}
        onSubmitEditing={() => props.onSearch(selectedValue)}
        onChangeText={(value) => {
          if (value.length == 4) setSelectedValue('');
          setSelectedValue(value);
        }}
        value={selectedValue}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-around',
        }}>
        <Numbers
          value={selectedValue}
          focus={() => {
            setSelectedValue('');
            inputRef.current.focus();
          }}
        />
        <Button icon="search1" onPress={() => props.onSearch(selectedValue)} containerStyle={{ backgroundColor: '#006AB5', borderColor: 'transparent' }} iconColor={'#FFF'} />
        <Button icon="reload1" onPress={clear} />
      </View>
    </View>
  );
};

export default Controller;

const styles = StyleSheet.create({
  numbers: {
    // marginBottom: 3,
    elevation: 10,
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: '10%',
    paddingHorizontal: '3%',
    // position: 'absolute',
    // top: 0
  },
  input: {
    position: 'absolute',
    // top: -height,
    // width: 0,
    // height: 0,
    // fontSize: 1,
    opacity: 0,
  },
  buttons: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});
