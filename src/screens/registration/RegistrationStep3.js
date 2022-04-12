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
import moment from 'moment';
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
import {newCarBrands} from '../../utils/Functions';

const RegistrationStep3 = ({navigation}) => {
  var _ = require('lodash');

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

  const getInitialValue = () => {
    if (dataSlotPickerTitle === constVar.selectCar) {
      return data.carBrand;
    } else {
      return parseInt(data.carDate);
    }
  };

  const openPicker = option => {
    if (option === 2) {
      setPickerData(['-'].concat(_.tail(newCarBrands)));
      setDataSlotPickerTitle(constVar.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(
        ['-'].concat(range(2000, parseInt(moment().format('YYYY')))),
      );
      setDataSlotPickerTitle(constVar.selectCarAge);
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
  const goToStep2 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_4);
  };
  return (
    <BaseView removePadding={true} statusBarColor={'transparent'}>
      <ProgressStepBar step={3} />

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
            Πληροφορίες οχήματος
          </Text>
          <Text style={{color: '#8b9cb5', marginTop: 5}}>
            Αν δεν διαθέτεις όχημα μπορείς να συνεχίσεις
          </Text>
          <Spacer height={5} />
          <CustomInput
            onPressIn={() => {
              openPicker(2);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={constVar.carBrand}
            keyboardType="numeric"
            value={data.carBrand}
          />

          <CustomInput
            onPressIn={() => {
              openPicker(3);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={constVar.carAgeLabel}
            keyboardType="default"
            value={data.carDate}
          />
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
        initialValue1={getInitialValue()}
      />
      <RoundButton
        //disabled={!validFields()}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={'Συνέχεια'}
        onPress={goToStep2}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep3;

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
