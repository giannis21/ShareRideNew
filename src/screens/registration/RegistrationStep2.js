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
  TouchableOpacity,
  Dimensions,
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

const RegistrationStep2 = ({navigation}) => {
  var _ = require('lodash');

  const [selectedGender, setSelectedGender] = useState(null);
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

  const onPhoneChanged = value => {
    setData({...data, phone: value});
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

  const goBack = () => {
    navigation.goBack();
  };
  const goToStep3 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_3);
  };
  const {genderContainer} = styles;
  return (
    <BaseView removePadding={true} statusBarColor={'transparent'}>
      <ProgressStepBar step={2} />

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
            Το φύλο μου είναι
          </Text>
          <Spacer height={Dimensions.get('window').height / 4} />

          <TouchableOpacity
            activeOpacity={1}
            style={[
              genderContainer,
              {
                borderColor:
                  selectedGender === 'man'
                    ? colors.colorPrimary
                    : colors.grey400,
                justifyContent: 'center',
              },
            ]}
            onPress={() => {
              setSelectedGender('man');
            }}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  selectedGender === 'man'
                    ? colors.colorPrimary
                    : colors.title_grey,
              }}>
              Άνδρας
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={[
              genderContainer,
              {
                borderColor:
                  selectedGender === 'woman'
                    ? colors.colorPrimary
                    : colors.grey400,
                marginTop: 20,
              },
            ]}
            onPress={() => {
              setSelectedGender('woman');
            }}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  selectedGender === 'woman'
                    ? colors.colorPrimary
                    : colors.title_grey,
              }}>
              Γυναίκα
            </Text>
          </TouchableOpacity>
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
        // disabled={!validFields()}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={'Συνέχεια'}
        onPress={goToStep3}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep2;

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
  genderContainer: {
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
    borderWidth: 1,
  },
});
