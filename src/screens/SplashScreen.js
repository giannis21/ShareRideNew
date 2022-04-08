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
const SplashScreen = ({navigation, route}) => {
  var _ = require('lodash');

  const isFocused = useIsFocused();
  let dispatch = useDispatch();

  useEffect(() => {
    mainOperation();
  }, []);

  const mainOperation = async () => {
    if (!isFocused) return;
    let email = await getValue(keyNames.email);
    let password = await getValue(keyNames.password);
    console.log('giannis');
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
    console.log('success ');
    createToken({
      email: email,
      password: password,
      successCallBack: userSuccessCallback,
      errorCallback: userErrorCallback,
    });
  };

  const userSuccessCallback = (message, user) => {
    console.log('success ');
    dispatch({type: LOGIN_USER, payload: user});
    goToHome();
  };

  const userErrorCallback = (message, otp, email) => {
    console.log('erorrrrr ');
    //  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
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
      <Text style={{justifyContent: 'center', alignSelf: 'center'}}>
        textttytttt
      </Text>
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
