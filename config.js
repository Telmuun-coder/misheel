import AsyncStorage from '@react-native-community/async-storage';

const ips = {
  mobicom: `http://172.16.30.29`,
  unitel: 'http://172.16.20.29',
};


// export let sim = ips.mobicom; 
export let sim = null; 

let config = {
  // localIp: 'http://192.168.137.1',
  // localIp: 'http://192.168.100.82',
  localIp: 'http://0.0.0.0',
  eBarimtPut: `${sim}:9000/bill/putArray`,
  send: `${sim}:9000/send/`,
  apiMinu: `${sim}:6085`,
  apiMinu2: 'http://api.minu.mn', 
};

//shuud export hiij uzeh file aa
export const setIp = (localIp) => {
  config.localIp = 'http://' + localIp;
  AsyncStorage.setItem('localId', localIp);
};

export const setSimcard = (simType) => {
  console.log("setting simtype:", simType);
  sim = simType == 'mobicom' ? ips.mobicom : ips.unitel;
  config.apiMinu = `${sim}:6085`;
  config.eBarimtPut = `${sim}:9000/bill/putArray`;
  config.send= `${sim}:9000/send/`
  console.log(config);
  AsyncStorage.setItem('simType', simType);
};

export default config;
