import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Image,
  BackHandler,
} from 'react-native';

import {routes} from '../navigation/RouteNames';
import {
  createToken,
  forgotPass,
  getUserFromStorage,
} from '../services/AuthServices';

import {useIsFocused} from '@react-navigation/native';
import {constVar} from '../utils/constStr';
import {useSelector, useDispatch} from 'react-redux';
import {ADD_END_DATE, LOGIN_USER} from '../actions/types';
import {getValue, keyNames} from '../utils/Storage';
import {InfoPopupModal} from '../utils/InfoPopupModal';
import VersionCheck from 'react-native-version-check';
import {version} from '../../package.json';

import {ForceUpdateModal} from '../utils/ForceUpdateModal';
const SplashScreen = ({navigation, route}) => {
  var _ = require('lodash');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const isFocused = useIsFocused();
  let dispatch = useDispatch();

  const [linkStore, setLinkStore] = useState('');
  const checkVersion = () => {
    return new Promise(resolve => {
      VersionCheck.needUpdate().then(async res => {
        const OsVer = Platform.constants['osVersion'];
        console.log({version});
        //setLinkStore(res?.storeUrl);
        //checkAppViolation(res?.isNeeded);
        resolve();
      });
    });
  };

  useEffect(() => {
    // checkAppViolation();
    //checkVersion().then(() => {});
  }, []);

  useEffect(() => {
    mainOperation();
  }, []);

  const mainOperation = async () => {
    if (!isFocused) return;
    let email = await getValue(keyNames.email);
    let password = await getValue(keyNames.password);

    if (email === '' || _.isUndefined(email)) {
      goToLogin();
    } else {
      let lastloginDate = await getValue(keyNames.lastLoginDate);
      const nowDate = new Date();

      const milli = nowDate.getTime().toString();
      let diff = parseInt(milli) - parseInt(lastloginDate);
      const seconds = diff / 1000;
      const minutes = seconds / 60;
      const hours = minutes / 60;
      const days = hours / 24;

      if (days < 55) {
        onLogin(email, password);
      } else {
        getUserFromStorage().then(user => {
          dispatchValues(user);
          goToHome();
        });
      }
    }
  };
  const dispatchValues = user => {
    dispatch({type: LOGIN_USER, payload: user});
  };
  const onLogin = (email, password) => {
    createToken({
      email: email,
      password: password,
      successCallBack: userSuccessCallback,
      errorCallback: userErrorCallback,
    });
  };

  const userSuccessCallback = (message, user) => {
    dispatch({type: LOGIN_USER, payload: user});
    goToHome();
  };

  const userErrorCallback = (message, otp, email) => {
    goToLogin();
  };

  const goToHome = () => {
    try {
      navigation.navigate(routes.HOMESTACK, {
        screen: routes.SEARCH_ROUTE_SCREEN,
      });
    } catch (err) {
      console.log();
    }
  };
  const goToLogin = () => {
    navigation.navigate(routes.LOGIN_SCREEN);
  };
  return (
    <View>
      <ForceUpdateModal
        isVisible={false}
        description={constVar.changePassDescription}
        buttonText={constVar.go}
        closeAction={() => {
          setIsModalVisible(false);
        }}
        buttonPress={() => {}}
        descrStyle={true}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  forgotPass: {
    color: '#8b9cb5',
    alignSelf: 'flex-end',
  },
});
