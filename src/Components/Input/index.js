import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Input = (props) => {
  const [val, setVal] = useState(props.value ? props.value : '');
  // const [red, setRed] = useState(props.danger);
  // useEffect(() => {
  //   setRed(props.danger);
  // }, [props.danger]);
  return (
    <View style={[styles.inputContainer, props.danger && styles.danger]}>
      <Text style={styles.type}>{props.title}</Text>
      <TextInput
        // onFocus={() => {
        //   props.onChange(val);
        // }}
        onChangeText={(e) => {
          props.onChange(e);
          setVal(e);
        }}
        autoCapitalize={props.register && 'characters'}
        placeholder={props.placeHolder ? props.placeHolder : null}
        style={styles.input}
        maxLength={props.type === 'number' ? 12 : 100}
        maxLength={props.max}
        autoCorrect={false}
        autoFocus={props.focus}
        value={val}
        keyboardType={
          props.type === 'email'
            ? 'email-address'
            : props.type === 'number'
            ? 'phone-pad'
            : 'default'
        }
        secureTextEntry={props.type === 'password' ? true : false}
        multiline={props.multiline ? true : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#f2f0f0',
    width: windowWidth * 0.7,
    height: windowHeight * 0.075,
    paddingVertical: 5,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: 'center',
  },
  type: {
    color: '#BFBFBF',
    fontSize: 10,
    textAlign: 'center',
  },
  input: {
    minHeight: 30,
    fontSize: 16,
    padding: 0,
    paddingBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 0,
  },
  danger: {borderWidth: 0.5, borderColor: 'red'},
});

export default Input;
