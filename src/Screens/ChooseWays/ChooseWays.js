import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native'
import React from 'react'

const ChooseWays = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Hanburner')}>
          <Image source={require('../../Images/ParkingLogin.png')} style={styles.img} />
          <Text style={styles.label}>Зогсоолын төлбөр</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InputDiscountAmount')}>
          <Image source={require('../../Images/eco.jpg')} style={styles.img} />
          <Text style={styles.label}>Эко-Паркын тасалбар</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

export default ChooseWays

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20
  },
  button: {
    // flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.5,
    borderColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFF',
    elevation: 10
  },
  img: {
    width: '95%',
    height: 80,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20
  }
});