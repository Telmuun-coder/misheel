import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Input from '../../Components/Input';
import Button from '../../Components/ButtonL';
import Icon from 'react-native-vector-icons/AntDesign';
import Spinner from '../../Components/Spinner';
import {UserState} from '../../Context/UserStore';
// import ErrorMessage from '../../Components/ErrorMessage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = ({navigation}) => {
  const {auth, spin} = useContext(UserState);
  const [rem, setRem] = useState('had');
  const [number, setNumber] = useState('postpos'); //88564757,99887788,99115544
  const [password, setPassword] = useState('12345678'); //12345678

  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
          style={styles.logo}
          source={require('../../Images/parkingLogo.png')}
        />
        <Text style={styles.title}>Авто зогсоолын систем</Text>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: windowHeight * 0.065 * 3.5,
        }}>
        {/* <ErrorMessage /> */}
        <Input
          value={number}
          onChange={(e) => setNumber(e)}
          title="Бүртгэлтэй утасны дугаар"
          placeHolder=""
          // type="number"
        />
        <Input
          onChange={(e) => setPassword(e)}
          value={password}
          title="Нууц үг"
          placeHolder=""
          type="password"
        />
        <View style={styles.btnCon}>
          <TouchableOpacity
            onPress={() => setRem((Prev) => (Prev == 'had' ? 'hud' : 'had'))}
            style={styles.remember}>
            <Icon
              name="checkcircle"
              color={rem === 'had' ? '#006AB5' : '#8F8F8F'}
              size={25}
            />
            <Text style={{marginLeft: 5}}>Сануулах</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center'}}>
            <Text>Нууц үг мартсан</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Button
          title="НЭВТРЭХ"
          onClick={() => {
            console.log('hadgalhimu yaahy: ', rem);
            auth.login(number, password, rem);
          }}
        />
      </View>
      <View style={styles.settingCon}>
        <TouchableOpacity style={styles.setting} onPress={() => navigation.navigate('Settings')}>
          <Icon name="setting" size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <Spinner visible={spin} />
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  settingCon: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  setting: {
    zIndex: 100,
    width: 40,
    height: 40,
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  remember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25%',
    alignItems: 'center',
  },
  btnCon: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignSelf: 'center',
    paddingLeft: '10%',
  },
});
