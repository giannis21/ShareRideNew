import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BaseView} from '../layout/BaseView';
import {Spacer} from '../layout/Spacer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {RoundButton} from '../Buttons/RoundButton';
import {colors} from '../utils/Colors';
import {routes} from '../navigation/RouteNames';
import {createToken, restorePassword} from '../services/AuthServices';
import {Loader} from '../utils/Loader';
import {CustomInput} from '../utils/CustomInput';
import {InfoPopupModal} from '../utils/InfoPopupModal';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {getValue, setValue} from '../utils/Storage';
import {constVar} from '../utils/constStr';
import {CloseIconComponent} from '../components/CloseIconComponent';
import {CustomText} from '../components/CustomText';
let hasErrors = false;
const RestorePasswordScreen = ({navigation, route}) => {
  var _ = require('lodash');
  const [data, setData] = React.useState({
    password: '',
    passwordConfirm: '',
    currentPassword: '',
    secureTextEntry: true,
    secureTextEntryConfirmed: true,
    secureTextEntryCurrent: true,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [infoMessage, setInfoMessage] = React.useState({
    hasError: false,
    message: false,
  });
  const [email, setEmail] = useState(route.params.email);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setData({
        password: '',
        passwordConfirm: '',
        currentPassword: '',
        secureTextEntry: true,
        secureTextEntryConfirmed: true,
        secureTextEntryCurrent: true,
      });
      setIsLoading(false);
      setInfoMessage({hasError: false, message: false});
      setShowInfoModal(false);
    });

    return unsubscribe;
  }, [navigation]);

  function showCustomLayout(callback) {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 3000);
  }

  const successCallBack = message => {
    setInfoMessage({hasError: false, message});
    showCustomLayout(() => {
      route.params.isRestore
        ? navigation.navigate(routes.LOGIN_SCREEN)
        : navigation.goBack();
    });
  };

  const errorCallback = message => {
    setInfoMessage({hasError: true, message});
    showCustomLayout();
  };

  const onButtonPressed = () => {
    Keyboard.dismiss();
    if (
      _.isEmpty(data.password) ||
      _.isEmpty(data.passwordConfirm) ||
      (!route.params.isRestore && _.isEmpty(data.currentPassword))
    ) {
      setInfoMessage({hasError: true, message: constVar.fillFirst});
      showCustomLayout();
    } else if (
      data.password.length < 5 ||
      data.passwordConfirm.length < 5 ||
      (!route.params.isRestore && data.currentPassword.length < 5)
    ) {
      setInfoMessage({hasError: true, message: constVar.passLength});
      showCustomLayout();
    } else if (data.password !== data.passwordConfirm) {
      setInfoMessage({hasError: true, message: constVar.passwordDifferent});
      showCustomLayout();
    } else if (
      data.currentPassword === data.passwordConfirm ||
      data.currentPassword === data.password
    ) {
      setInfoMessage({
        hasError: true,
        message: 'ο τρέχων κωδικός πρέπει να είναι διαφορετικός απο τον νέο.',
      });
      showCustomLayout();
    } else {
      let password = data.password;
      restorePassword({
        email,
        password,
        successCallBack: successCallBack,
        errorCallback: errorCallback,
      });
    }
  };

  const onPasswordChanged = value => {
    setData({...data, password: value});
  };
  const onPasswordConfirmedChanged = value => {
    setData({...data, passwordConfirm: value});
  };
  const oncurrentPasswordChanged = value => {
    setData({...data, currentPassword: value});
  };
  const updateSecureTextEntry = () => {
    setData({...data, secureTextEntry: !data.secureTextEntry});
  };
  const updateSecureTextEntryCurrent = () => {
    setData({...data, secureTextEntryCurrent: !data.secureTextEntryCurrent});
  };

  const updateSecureTextEntryConfirmed = () => {
    setData({
      ...data,
      secureTextEntryConfirmed: !data.secureTextEntryConfirmed,
    });
  };

  const onBackIconPress = () => {
    route.params.isRestore
      ? navigation.navigate(routes.LOGIN_SCREEN)
      : navigation.goBack();
  };

  return (
    <View>
      <Loader isLoading={isLoading} />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.message}
        icon={infoMessage.hasError ? 'x-circle' : 'check-circle'}
        success={!infoMessage.hasError}
      />

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.topContainer}>
          <CloseIconComponent onPress={onBackIconPress} />

          <CustomText
            type={'header'}
            containerStyle={{marginStart: 14}}
            text={constVar.newPass}
          />
        </View>

        <View style={{paddingHorizontal: 16}}>
          <Spacer height={80} />
          {!route.params.isRestore && (
            <CustomInput
              text={constVar.giveCurrentPass}
              secureTextEntry={data.secureTextEntryCurrent ? true : false}
              onChangeText={oncurrentPasswordChanged}
              onIconPressed={updateSecureTextEntryCurrent}
              hasIcon={true}
              value={data.currentPassword}
            />
          )}

          <CustomInput
            text={constVar.givePass}
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={onPasswordChanged}
            onIconPressed={updateSecureTextEntry}
            hasIcon={true}
            value={data.password}
          />

          <CustomInput
            text={constVar.confirmPass}
            secureTextEntry={data.secureTextEntryConfirmed ? true : false}
            onChangeText={onPasswordConfirmedChanged}
            onIconPressed={updateSecureTextEntryConfirmed}
            hasIcon={true}
            value={data.passwordConfirm}
          />

          <CustomText
            containerStyle={{marginTop: 5, marginBottom: 30}}
            text={constVar.passLengthNote}
            type={'note'}
          />

          <RoundButton
            text={constVar.go}
            backgroundColor={colors.colorPrimary}
            onPress={onButtonPressed}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RestorePasswordScreen;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginStart: 10,
  },
});
