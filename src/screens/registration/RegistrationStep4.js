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
import {PictureComponent} from '../../components/PictureComponent';

const RegistrationStep4 = ({navigation}) => {
  var _ = require('lodash');
  const [singleFile, setSingleFile] = useState(null);

  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );

  let initalData = {
    email: '',
    password: '',
    carBrand: null,
    checked: 'male',
    carDate: null,
    passwordConfirmed: '',
    secureTextEntry: true,
    secureTextEntryConfirmed: true,
    fullName: '',
    phone: '',
    age: '',
    gender: 'man',
  };
  const [data, setData] = useState(initalData);

  const onFullNameChanged = value => {
    setData({...data, fullName: value});
  };

  const onImageClick = () => {
    if (Platform.OS === 'android') {
      requestAndroidPermission();
    } else {
      requestIosPermission();
    }
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
      data.fullName.length >= 3 &&
      regex.phoneNumber.test(data.phone) &&
      data.phone !== ''
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
  const goToStep5 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_5);
  };
  return (
    <BaseView removePadding={true} statusBarColor={'transparent'}>
      <ProgressStepBar step={4} />

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
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Εικόνα προφίλ
          </Text>
          <Text style={{color: '#8b9cb5', marginTop: 5}}>
            Μπορείς να επιλέξεις απο το κινητό σου, η να τραβήξεις με την κάμερα
          </Text>
          <Spacer height={25} />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Platform.OS === 'android' ? 35 : 0,
            }}>
            <PictureComponent
              singleFile={singleFile}
              openCamera={true}
              onPress={onImageClick}
              imageSize={'big'}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

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
        //disabled={!validFields()}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={'Συνέχεια'}
        onPress={goToStep5}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep4;

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
