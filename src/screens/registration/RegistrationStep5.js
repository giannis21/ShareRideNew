import React, { useState, useEffect, useRef } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import { ProgressStepBar } from '../../components/ProgressStepBar';
import { BaseView } from '../../layout/BaseView';
import { CustomIcon } from '../../components/CustomIcon';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { CustomInput } from '../../utils/CustomInput';
import { constVar } from '../../utils/constStr';
import { Spacer } from '../../layout/Spacer';
import { range } from 'lodash';
import { DataSlotPickerModal } from '../../utils/DataSlotPickerModal';
import { RoundButton } from '../../Buttons/RoundButton';
import { colors } from '../../utils/Colors';
import { regex } from '../../utils/Regex';
import { routes } from '../../navigation/RouteNames';
import { Loader } from '../../utils/Loader';
import { CheckBox } from 'react-native-elements';
import { Paragraph } from '../../components/HOCS/Paragraph';
import { useSelector } from 'react-redux';
import { showToast } from '../../utils/Functions';
let myTimeout;
const RegistrationStep5 = ({ navigation, route }) => {
  var _ = require('lodash');
  const content = useSelector(state => state.contentReducer.content);

  const { registerData } = route.params;

  const [istermsChecked, setIsTermsChecked] = useState(false);
  const [pickerData, setPickerData] = useState([]);

  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );

  let initalData = {
    email: '',
    password: '',
    passwordConfirmed: '',
    secureTextEntry: true,
    secureTextEntryConfirmed: true,
  };
  const [data, setData] = useState(initalData);

  const onFullNameChanged = value => {
    setData({ ...data, fullName: value });
  };

  const onPhoneChanged = value => {
    setData({ ...data, phone: value });
  };

  const setDatePickerValues = selectedValue => {
    if (dataSlotPickerTitle === constVar.selectAge) {
      setData({ ...data, age: selectedValue });
    } else if (dataSlotPickerTitle === constVar.selectCar) {
      setData({ ...data, carBrand: selectedValue });
    } else {
      setData({ ...data, carDate: selectedValue });
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
      regex.email.test(data.email) &&
      istermsChecked
    );
  };
  const onEmailChanged = value => {
    setData({ ...data, email: value });
  };

  const onPasswordChanged = value => {
    setData({ ...data, password: value });
  };
  const onPasswordConfirmedChanged = value => {
    setData({ ...data, passwordConfirmed: value });
  };
  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
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
      showToast(content.passwordDifferent, false)
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
    <BaseView
      removePadding={true}
      statusBarColor={'white'}
      barStyle="dark-content">
      <ProgressStepBar step={5} />
      <Loader isLoading={false} />
      <CloseIconComponent
        showArrow={true}
        onPress={goBack}
        containerStyle={{ marginStart: 10, marginTop: 10 }}
      />

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{ paddingHorizontal: 16 }}>
          <Spacer height={25} />

          <CustomInput
            text={content.hereEmail}
            keyboardType="email-address"
            onChangeText={onEmailChanged}
            value={data.email}
            errorText={content.emailNotValid}
            isError={!regex.email.test(data.email) && data.email !== ''}
          />
          <CustomInput
            text={content.herePass}
            keyboardType="default"
            errorText={content.passwordIncorrect}
            isError={data.password.length < 5 && data.password !== ''}
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={onPasswordChanged}
            onIconPressed={updateSecureTextEntry}
            hasIcon={true}
            value={data.password}
          />

          <CustomInput
            text={content.confirmPass}
            keyboardType="default"
            errorText={content.passwordIncorrect}
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
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <CheckBox
            checkedColor={colors.colorPrimary}
            uncheckedColor={colors.colorPrimary}
            onPress={() => {
              setIsTermsChecked(!istermsChecked);
            }}
            checked={istermsChecked}
          />



          <Paragraph containerStyle={{ flexShrink: 1, marginStart: -5 }}>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
              }}>
              {content.iHaveRead}
            </Text>
            <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline', color: 'black' }}>
              {content.terms}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
              }}>
              {content.andAgreeWith}
            </Text>
            <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline', color: 'black' }}>
              {content.policy}
            </Text>
          </Paragraph>
        </View>
      </KeyboardAwareScrollView>
      <Loader isLoading={false} />

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
        text={content.register}
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
