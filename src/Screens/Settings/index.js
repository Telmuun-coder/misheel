import React, {useState, useLayoutEffect, useRef, useContext} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import config, {setIp, setSimcard, sim} from '../../../config';
import AsyncStorage from '@react-native-community/async-storage';
import RadioPIcker from '../../Components/RadioPIcker';
import { UserState } from '../../Context/UserStore';

const {width, height} = Dimensions.get('window');

const Settings = ({navigation}) => {
  const pickerRef = useRef(null);
  const {setStater, state} = useContext(UserState);
  const [localIp, setLocalIp] = useState(null);
// const [companyId, setCompanyId] = useState(null);
  const [nonValid, setNonValid] = useState(false);
  const [sim, setSim] = useState(null);
  //   console.log()
  const valid = (localIp) => {
    setLocalIp(localIp);
    // if (localIp.match(/\./g).length == 4) setNonValid(false);
    // else setNonValid(true);
  };

  const changeSim = (simType) => {
    setSim(simType);
    setSimcard(simType);
  };

  const handleSave = () => {
    if (nonValid) return;
    // setStater('organization_id',companyId);    
    setIp(localIp);
    navigation.goBack();
  };


  useLayoutEffect(()=>{
    const getInitValue = async () => {
      const simType = await AsyncStorage.getItem('simType');
      const localIp = await AsyncStorage.getItem('localId');
      console.log("sim:", simType);
      
      if(simType) {
        setSim(simType);
        pickerRef.current.setTypeValue(simType);
      }; 
      if(localIp) setLocalIp(localIp);


      // setCompanyId(state.organization_id);
    }
    getInitValue();
  },[])

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.row}>
        <Text style={styles.title}>Local IP:</Text>
        <TextInput
          textAlign="center"
          style={styles.input}
          placeholder="0.0.0.0"
          maxLength={15}
          value={localIp}
          keyboardType="number-pad"
          // onSubmitEditing={handleSave}
          onChangeText={(val) => valid(val)}
        />
      </View>

      {/* <View style={styles.row}>
        <Text style={styles.title}>Байгууллагын {'\n'}дугаар:</Text>
        <TextInput
          textAlign="center"
          style={styles.input}
          placeholder="0000"
          maxLength={10}
          value={companyId}
          keyboardType="number-pad"
          // onSubmitEditing={handleSave}
          onChangeText={(id) => setCompanyId(id)}
        />
      </View> */}

      <RadioPIcker simType={sim} onPress={changeSim} ref={pickerRef}/>
    
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
  pickerCon: {

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    // backgroundColor: 'gray',
    height: 45,
    width,
    marginVertical: 8
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
