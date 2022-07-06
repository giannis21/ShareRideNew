import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Image,
  BackHandler,
  Linking,
} from 'react-native';
import { NativeModules } from 'react-native';
import { routes } from '../navigation/RouteNames';
import {
  createToken,
  forgotPass,
  getUserFromStorage,
} from '../services/AuthServices';

import { useIsFocused } from '@react-navigation/native';
import { constVar } from '../utils/constStr';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_END_DATE, LOGIN_USER } from '../actions/types';
import { getValue, keyNames } from '../utils/Storage';
import { InfoPopupModal } from '../utils/InfoPopupModal';
import VersionCheck from 'react-native-version-check';
import { version } from '../../package.json';
import JailMonkey from 'jail-monkey';
import { ForceUpdateModal } from '../utils/ForceUpdateModal';
import { CommonStyles } from '../layout/CommonStyles';
import { showToast } from '../utils/Functions';

const { NativeModuleManager } = NativeModules;

const SplashScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { logoStyle } = CommonStyles;
  const isFocused = useIsFocused();
  let dispatch = useDispatch();

  const [linkStore, setLinkStore] = useState('');
  const checkVersion = user => {
    return new Promise(resolve => {
      VersionCheck.needUpdate()
        .then(async res => {
          if (res?.isNeeded) {
            setLinkStore(res?.storeUrl);
            setIsModalVisible(true);
          } else {
            dispatch({ type: LOGIN_USER, payload: user });
            goToHome();
          }

          resolve();
        })
        .catch(err => {
          dispatch({ type: LOGIN_USER, payload: user });
          goToHome();
        });
    });
  };

  useEffect(() => {
    checkAppViolation();
    // mainOperation();
  }, []);

  const mainOperation = async () => {
    if (!isFocused) return;
    let email = await getValue(keyNames.email);
    let password = await getValue(keyNames.password);

    if (email === '' || _.isUndefined(email)) {
      goToLogin();
    } else {
      onLogin(email, password);
    }
  };

  const checkAppViolation = () => {
    const isJailBroken = JailMonkey.isJailBroken();
    const hookDetected = JailMonkey.hookDetected();
    const externalStorage = JailMonkey.isOnExternalStorage();
    const message = JailMonkey.jailBrokenMessage();

    if (
      Platform.OS === 'ios'
        ? isJailBroken
        : hookDetected || (externalStorage && false)
    ) {
      showToast(message
        ? message
        : 'Κάτι πάει στραβά με το violation της εφαρμογής.', false)

      setTimeout(function () {
        NativeModuleManager.exitApp();
      }, 4000);
    } else {
      mainOperation();
    }
  };

  const dispatchValues = user => {
    dispatch({ type: LOGIN_USER, payload: user });
  };
  const onLogin = (email, password) => {
    createToken({
      email: email,
      password: password,
      successCallBack: userSuccessCallback,
      errorCallback: userErrorCallback,
    });
  };

  const userSuccessCallback = (message, user, forceUpdate) => {
    if (forceUpdate) {
      checkVersion(user).then(() => { });
    } else {
      dispatch({ type: LOGIN_USER, payload: user });
      goToHome();
    }
  };

  const userErrorCallback = (message, otp, email) => {
    goToLogin();
  };

  const goToHome = () => {
    navigation.navigate(routes.HOMESTACK, {
      screen: routes.SEARCH_ROUTE_SCREEN,
    });
  };

  const goToLogin = () => {
    navigation.navigate(routes.LOGIN_SCREEN);
  };

  return (
    <View>
      <ForceUpdateModal
        isVisible={isModalVisible}
        description={constVar.changePassDescription}
        buttonText={constVar.go}
        buttonPress={() => {
          Linking.openURL(linkStore);
        }}
        descrStyle={true}
      />

      <Image
        style={logoStyle}
        source={require('../assets/images/logo_transparent.png')}
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
