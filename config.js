let config = {
  localIp: 'http://192.168.137.1', //'http://192.168.100.185',
  eBarimtPut: 'http://172.16.20.26:9000/bill/putArray', //172.16.30.26:9000=> mobi SIM
  apiMinu: 'http://172.16.20.29:6085', //'', //http://api.minu.mn || 172.16.30.29 => Mobi SIM
  apiMinu2: 'http://api.minu.mn', //'http://192.168.160.30:6085', //http://api.minu.mn
};
//shuud export hiij uzeh file aa
export const setIp = (localIp) => {
  config.localIp = 'http://' + localIp;
};

export default config;
