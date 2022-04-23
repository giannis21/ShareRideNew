import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Image,
  InteractionManager,
  PermissionsAndroid,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import {ProgressStepBar} from '../../components/ProgressStepBar';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import {BaseView} from '../../layout/BaseView';
import {CustomIcon} from '../../components/CustomIcon';
import {CloseIconComponent} from '../../components/CloseIconComponent';
import {CustomInput} from '../../utils/CustomInput';
import {constVar} from '../../utils/constStr';
import {Spacer} from '../../layout/Spacer';
import {range} from 'lodash';
import {DataSlotPickerModal} from '../../utils/DataSlotPickerModal';
import {RoundButton} from '../../Buttons/RoundButton';
import {colors} from '../../utils/Colors';
import {regex} from '../../utils/Regex';
import {routes} from '../../navigation/RouteNames';
import {Loader} from '../../utils/Loader';
import RNFetchBlob from 'rn-fetch-blob';
import {registerUser} from '../../services/AuthServices';

const RegistrationStep5 = ({navigation, route}) => {
  var _ = require('lodash');
  const {registerData} = route.params;

  const [isLoading, setIsLoading] = useState(false);

  const [pickerData, setPickerData] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );

  console.log({registerData});
  let initalData = {
    email: '',
    password: '',
    passwordConfirmed: '',
    secureTextEntry: true,
    secureTextEntryConfirmed: true,
  };
  const [data, setData] = useState(initalData);

  const onFullNameChanged = value => {
    setData({...data, fullName: value});
  };

  const onPhoneChanged = value => {
    setData({...data, phone: value});
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 3000);
  };

  const setDatePickerValues = selectedValue => {
    if (dataSlotPickerTitle === constVar.selectAge) {
      setData({...data, age: selectedValue});
    } else if (dataSlotPickerTitle === constVar.selectCar) {
      setData({...data, carBrand: selectedValue});
    } else {
      setData({...data, carDate: selectedValue});
    }
  };

  const openPicker = option => {
    if (option === 1) {
      setPickerData(range(18, 70));
      setDataSlotPickerTitle(constVar.selectAge);
      setDataSlotPickerVisible(true);
    }
  };
  const validFields = () => {
    return (
      data.password.length >= 5 &&
      data.passwordConfirmed.length >= 5 &&
      regex.email.test(data.email)
    );
  };
  const onEmailChanged = value => {
    setData({...data, email: value});
  };

  const onPasswordChanged = value => {
    setData({...data, password: value});
  };
  const onPasswordConfirmedChanged = value => {
    setData({...data, passwordConfirmed: value});
  };
  const updateSecureTextEntry = () => {
    setData({...data, secureTextEntry: !data.secureTextEntry});
  };
  const updateSecureTextEntryConfirmed = () => {
    setData({
      ...data,
      secureTextEntryConfirmed: !data.secureTextEntryConfirmed,
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const retreiveOtp = async () => {
    if (data.password !== data.passwordConfirmed) {
      setInfoMessage({info: constVar.passwordDifferent, success: false});
      showCustomLayout();
      return;
    }

    navigation.navigate(routes.OTP_SCREEN, {
      goToRestore: false,
      showProgressBar: true,
      _email: data.email,
      registerData: {
        ...registerData,
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <BaseView removePadding={true} statusBarColor={'transparent'}>
      <ProgressStepBar step={5} />
      <Loader isLoading={false} />
      <CloseIconComponent
        onPress={goBack}
        containerStyle={{marginStart: 10, marginTop: 10}}
      />

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{paddingHorizontal: 16}}>
          <Spacer height={25} />

          <CustomInput
            text={constVar.hereEmail}
            keyboardType="email-address"
            onChangeText={onEmailChanged}
            value={data.email}
            errorText={'To email δεν είναι έγκυρο'}
            isError={!regex.email.test(data.email) && data.email !== ''}
          />
          <CustomInput
            text={constVar.herePass}
            keyboardType="default"
            errorText={'κωδικός > 4 χαρακτήρες'}
            isError={data.password.length < 5 && data.password !== ''}
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={onPasswordChanged}
            onIconPressed={updateSecureTextEntry}
            hasIcon={true}
            value={data.password}
          />

          <CustomInput
            text={constVar.confirmPass}
            keyboardType="default"
            errorText={'κωδικός > 4 χαρακτήρες'}
            isError={
              data.passwordConfirmed.length < 5 && data.passwordConfirmed !== ''
            }
            secureTextEntry={data.secureTextEntryConfirmed ? true : false}
            onChangeText={onPasswordConfirmedChanged}
            onIconPressed={updateSecureTextEntryConfirmed}
            hasIcon={true}
            value={data.passwordConfirmed}
          />
        </View>
      </KeyboardAwareScrollView>
      <Loader isLoading={false} />

      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />

      <DataSlotPickerModal
        data={pickerData}
        title={dataSlotPickerTitle}
        isVisible={dataSlotPickerVisible}
        onClose={() => {
          setDataSlotPickerVisible(false);
        }}
        onConfirm={(selectedValue, secValue, thirdValue) => {
          setDatePickerValues(selectedValue.toString());
          setDataSlotPickerVisible(false);
        }}
        initialValue1={data.age}
      />
      <RoundButton
        disabled={!validFields()}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={'Εγγραφή'}
        onPress={retreiveOtp}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep5;

const styles = StyleSheet.create({
  circle: {
    borderRadius: 100 / 2,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  maskInputContainer: {
    marginVertical: Platform.OS === 'ios' ? 13 : 20,
    paddingVertical: Platform.OS === 'ios' ? 0 : 20,
    fontSize: 14,
    backgroundColor: 'black',
  },
});
