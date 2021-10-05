import React, {useState, createContext, useMemo, useEffect, useLayoutEffect} from 'react';
import {NativeModules} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import config, {setSimcard, setIp} from '../../config';

export const UserState = createContext();

const UserStore = (props) => {
  const {PayByCard} = NativeModules;
  const [spin, setSpin] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [mount, setMount] = useState(true);
  const [state, setState] = useState({
    userRole: null,
    token: null,
    organization_id: null,
    userId: null,
    error: null,
    parkingId: null,

    merchant: {},
    paCorporate: null,
    parkingList: [],
  });

  const setStater = (valName, val) => {
    // const oldState = state;
    // oldState[valName] = val;
    // setState({...oldState});
    setState({...state, [valName]: val});
  };

  const setStaterAll = (values) => {
    setState({...state, ...values});
  };

  const auth = useMemo(
    () => ({
      login: async (phoneNumber, password, remember) => {
        console.log(config);
        const user = {
          phone: phoneNumber,
          password: password,
        };
        setSpin(true);
        try {
          await PayByCard.doData(); //then((e) => console.log('switch internet source in login: ', e));
          let res = await axios.post(
            config.apiMinu + '/parking/paUser/login',
            user,
          );
          if (res.data.message === 'Амжилттай') {
            // console.log("loginData:",JSON.stringify(res.data.entity));
            console.log("ORG ID:",res.data.entity.paUser.paParkingList[0].organizationId);
            let tmp = {
              error: null,
              token: res.data.entity.token,
              merchant: res.data.entity.paUser.paMerchant,
              paCorporate: res.data.entity.paUser.paCorporate,
              userId: res.data.entity.paUser.userId,
              parkingList: res.data.entity.paUser.paParkingList,
              parkingId: res.data.entity.paUser.paParkingList[0].parkingId,
              userRole: res.data.entity.paUser.paRoleList[0].code,
              organization_id: res.data.entity.paUser.paParkingList[0].organizationId
              // organization_id: 29
            };
            remember === 'had' && cacheState(tmp);
            setStaterAll(tmp);
            setSpin(false);
          } else {
            alert(res.data.message);
            setStater('error', res.data.message);
            setSpin(false);
          }
        } catch (e) {
          if (e.message === 'Network Error') {
            alert('Та инернет холболтолтоо шалгана уу.');
            console.log(e.message);
            setSpin(false);
          }
        }
      },
      logout: async () => {
        await AsyncStorage.removeItem('state');
        setStater('token', null);
      },
    }),
    [],
  );

  const cacheState = async (tmp) => {
    await AsyncStorage.setItem('state', JSON.stringify(tmp));
  };

  // useEffect(() => {
  //   const restore = async () => {
  //     setTimeout(() => setShowSplash(false), 1000);
  //     const prevState = await AsyncStorage.getItem('state');
  //     if (prevState != null) {
  //       const tmp = JSON.parse(prevState);
  //       setState({...tmp});
  //     }
  //   };
  //   restore();
  // }, []);
  
  return (
    <UserState.Provider
      value={{
        state,
        setStater,
        setState,
        auth,
        setShowSplash,
        showSplash,
        setMount,
        spin,
      }}>
      {props.children}
    </UserState.Provider>
  );
};

export default UserStore;
