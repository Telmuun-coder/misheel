import React, {useState} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import config, {setIp} from '../../../config';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

const Settings = ({navigation}) => {
  const [state, setState] = useState({
    localIp: config.localIp.slice(7, config.localIp.length),
  });
  const [nonValid, setNonValid] = useState(false);
  //   console.log()
  const valid = (localIp) => {
    setState((prev) => ({...prev, localIp: localIp}));
    if (localIp.match(/\./g).length == 4) setNonValid(false);
    else setNonValid(true);
  };

  const handleSave = () => {
    if (nonValid) return;

    setIp(state.localIp);
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.row}>
        <Text style={styles.title}>Local IP:</Text>
        <TextInput
          textAlign="center"
          style={styles.input}
          placeholder="0.0.0.0"
          maxLength={15}
          value={state.localIp}
          keyboardType="number-pad"
          onSubmitEditing={handleSave}
          onChangeText={(val) => valid(val)}
        />
      </View>
      <TouchableHighlight
        style={[styles.btnSave, nonValid && styles.dis]}
        activeOpacity={0.6}
        onPress={handleSave}>
        <Text style={styles.btnTitle}>ХАДГАЛАХ</Text>
      </TouchableHighlight>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'gray',
    height: 35,
    width,
  },
  input: {
    fontSize: 20,
    width: width * 0.55,
    height: 35,
    borderRadius: 5,
    padding: 0,
    paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 16,
    alignSelf: 'flex-start',
    // paddingHorizontal: width * 0.15,
  },
  btnSave: {
    marginVertical: 50,
    width: width * 0.5,
    height: 35,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#404040',
  },
  dis: {
    opacity: 0.5,
  },
  btnTitle: {
    color: 'white',
    fontSize: 16,
  },
});
