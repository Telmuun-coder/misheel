import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';

const QRGenerate = () => {
  // const qr = useRef(null);
  // captureRef(qr, {
  //   format: 'jpg',
  //   quality: 0.8,
  // }).then(
  //   (uri) => console.log('Image saved to', uri),
  //   (error) => console.error('Oops, snapshot failed', error),
  // );
  // useEffect(()=>{
  // },[])
  onCapture = (uri) => {
    console.log('do something with ', uri);
  };
  return (
    <View style={styles.container}>
      <ViewShot onCapture={this.onCapture} captureMode="mount">
        <QRCode value="google.mn" />
      </ViewShot>
    </View>
  );
};

export default QRGenerate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
