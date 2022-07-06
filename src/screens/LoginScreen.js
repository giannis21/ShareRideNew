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
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseView } from '../layout/BaseView';
import { Spacer } from '../layout/Spacer';

import { RoundButton } from '../Buttons/RoundButton';
import { colors } from '../utils/Colors';
import { routes } from '../navigation/RouteNames';
import { createToken, forgotPass } from '../services/AuthServices';
import { Loader } from '../utils/Loader';
import { CustomInput } from '../utils/CustomInput';
import { InfoPopupModal } from '../utils/InfoPopupModal';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { LOGIN_USER } from '../actions/types';
import { getValue, keyNames, setValue } from '../utils/Storage';
import { CustomIcon } from '../components/CustomIcon';
import { setLanguage } from '../actions/actions';
import { showToast } from '../utils/Functions';

const LoginScreen = ({ navigation, route }) => {
  var _ = require('lodash');

  const [data, setData] = useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInput, setModalInput] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ info: '', success: false });

  const isFocused = useIsFocused();
  let passwordRef = useRef();
  let dispatch = useDispatch();

  const generalReducer = useSelector(state => state.generalReducer);
  const content = useSelector(state => state.contentReducer.content);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      BackHandler.exitApp();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setData({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
      });
      setIsModalVisible(false);
      setShowInfoModal(false);
      navigation.setParams({ message: undefined });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setTimeout(function () {
      if (isFocused) {
        if (!_.isUndefined(route.params?.message)) {
          showToast(route.params.message)

        }
      }
    }, 500);
  }, [isFocused]);

  const goToRegister = () => {
    navigation.navigate(routes.REGISTER_SCREEN, {
      screen: routes.REGISTER_SCREEN_STEP_1,
    });
  };

  const onEmailChanged = value => {
    setData({ ...data, email: value.replace(/ +/g, '') });
  };

  const onPasswordChanged = value => {
    setData({ ...data, password: value });
  };
  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };
  const modalInputChange = value => {
    setModalInput(value);
  };

  const onLogin = (email, password) => {
    if (!valid()) return;
    setIsLoading(true);
    createToken({
      email: email,
      password: password,
      fcmToken: generalReducer.fcmToken,
      successCallBack: userSuccessCallback,
      errorCallback: userErrorCallback,
    });
  };

  const valid = () => {
    if (_.isEmpty(data.email) || _.isEmpty(data.password)) {
      showToast(content.fillFirst, false)
      return false;
    }

    if (data.password.length < 5) {
      showToast(content.passLength, false)
      return false;
    }

    return true;
  };
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const modalSubmit = () => {
    closeModal();
    Keyboard.dismiss();
    navigation.navigate(routes.OTP_SCREEN, {
      _email: modalInput,
      goToRestore: true,
    });
  };
  const userSuccessCallback = (message, user) => {
    setIsLoading(false);
    dispatch({ type: LOGIN_USER, payload: user });
    navigation.navigate(routes.HOMESTACK, {
      screen: routes.SEARCH_ROUTE_SCREEN,
    });
  };

  const userErrorCallback = (message, otp, email) => {
    showToast(message, false)
    setIsLoading(false);
  };


  const changeLanguage = async () => {
    if (await getValue(keyNames.currentLanguage) === "GR") {
      await setValue(keyNames.currentLanguage, "EN")
      dispatch(setLanguage(require('../assets/content/contentEN.json')))
    } else {
      await setValue(keyNames.currentLanguage, "GR")
      dispatch(setLanguage(require('../assets/content/contentGR.json')))
    }
  }

  const { logoStyle } = styles;
  return (
    <BaseView statusBarColor={'white'} barStyle="dark-content">
      <Loader isLoading={isLoading} />

      <TouchableOpacity onPress={changeLanguage} style={{ flexDirection: 'row', alignSelf: 'flex-end', transform: [{ translateY: 10 }] }}>
        <CustomIcon
          name="swap"
          type="Entypo"
          size={20}
          color={colors.Gray3}
        />
        <Text style={{ marginStart: 7 }}>{content.Language}</Text>
      </TouchableOpacity>

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <Image
          style={logoStyle}
          source={require('../assets/images/logo_transparent.png')}
        />
        <View style={{ flex: 1 }}>


          <View style={{ marginTop: -26 }}>
            <CustomInput
              text={content.hereEmail}
              keyboardType="email-address"
              onChangeText={onEmailChanged}
              value={data.email}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
            />

            <CustomInput
              inputRef={passwordRef}
              text={content.herePass}
              keyboardType="default"
              secureTextEntry={data.secureTextEntry ? true : false}
              onChangeText={onPasswordChanged}
              onIconPressed={updateSecureTextEntry}
              hasIcon={true}
              value={data.password}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />

            <Spacer height={6} />

            <Text onPress={openModal} style={styles.forgotPass}>
              {content.forgotPass}
            </Text>

            <Spacer height={26} />
            <RoundButton
              text={content.login}
              onPress={() => {
                onLogin(data.email, data.password);
              }}
              backgroundColor={colors.colorPrimary}
            />
            <Spacer height={16} />

            <RoundButton
              text={content.register}
              textColor={colors.colorPrimary.toString()}
              onPress={goToRegister}
            />

          </View>

        </View>
        <InfoPopupModal
          isVisible={isModalVisible}
          description={content.changePassDescription}
          buttonText={content.go}
          closeAction={closeModal}
          buttonPress={modalSubmit}
          descrStyle={true}
          onChangeText={modalInputChange}
        />

      </KeyboardAwareScrollView>

    </BaseView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  forgotPass: {
    color: '#8b9cb5',
    alignSelf: 'flex-end',
  },
  logoStyle: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? -70 : -100,
  },
});
