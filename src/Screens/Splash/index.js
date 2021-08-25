import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../Images/parkingLogo.png')}
      />
      <Text style={styles.title}>Minu parking v1.0</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Hack',
    color: 'white',
  },
  logo: {
    width: 120,
    height: 120,
  },
});
