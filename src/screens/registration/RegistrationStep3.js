import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,

  Platform,

} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import moment from 'moment';
import { ProgressStepBar } from '../../components/ProgressStepBar';
import { BaseView } from '../../layout/BaseView';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { CustomInput } from '../../utils/CustomInput';
import { constVar } from '../../utils/constStr';
import { Spacer } from '../../layout/Spacer';
import { range } from 'lodash';
import { DataSlotPickerModal } from '../../utils/DataSlotPickerModal';
import { RoundButton } from '../../Buttons/RoundButton';
import { colors } from '../../utils/Colors';
import { routes } from '../../navigation/RouteNames';
import { newCarBrands } from '../../utils/Functions';
import { CustomText } from '../../components/CustomText';
import { useSelector } from 'react-redux';

const RegistrationStep3 = ({ navigation, route }) => {
  var _ = require('lodash');
  const content = useSelector(state => state.contentReducer.content);

  const { registerData } = route.params;
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    content.selectAge,
  );

  let initalData = {
    carBrand: null,
    carDate: null,
  };

  const [data, setData] = useState(initalData);

  const setDatePickerValues = selectedValue => {
    if (dataSlotPickerTitle === content.selectAge) {
      setData({ ...data, age: selectedValue });
    } else if (dataSlotPickerTitle === content.selectCar) {
      setData({ ...data, carBrand: selectedValue });
    } else {
      setData({ ...data, carDate: selectedValue });
    }
  };

  const disabledCta = () => {
    if (data.carBrand !== null && data.carDate !== null) return false;
    if (data.carBrand === null && data.carDate !== null) return true;
    if (data.carBrand !== null && data.carDate === null) return true;
  };

  const getInitialValue = () => {
    if (dataSlotPickerTitle === content.selectCar) {
      return data.carBrand;
    } else {
      return parseInt(data.carDate);
    }
  };

  const openPicker = option => {
    if (option === 2) {
      setPickerData(newCarBrands);
      setDataSlotPickerTitle(content.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(range(2000, parseInt(moment().format('YYYY')) + 1));
      setDataSlotPickerTitle(content.selectCarAge);
      setDataSlotPickerVisible(true);
    }
  };
  const validFields = () => {
    return data.carDate !== '' && data.carBrand !== '';
  };

  const goBack = () => {
    navigation.goBack();
  };
  const goToStep2 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_4, {
      registerData: Object.assign({}, registerData, data),
    });
  };
  return (
    <BaseView
      removePadding={true}
      statusBarColor={'white'}
      addStyleDynamically
      barStyle="dark-content">
      <ProgressStepBar step={3} />

      <CloseIconComponent
        onPress={goBack}
        showArrow={true}
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

          <CustomText text={content.carInfo} type="title0" />

          <Text style={{ color: colors.subtitleColor, marginTop: 5 }}>
            {content.noCarLabel}
          </Text>
          <Spacer height={5} />
          <CustomInput
            onPressIn={() => {
              openPicker(2);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={content.carBrand}
            keyboardType="numeric"
            value={data.carBrand}
          />

          <CustomInput
            onPressIn={() => {
              openPicker(3);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={content.carAgeLabel}
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
        disabled={disabledCta()}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={content.continue}
        onPress={goToStep2}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep3;

const styles = StyleSheet.create({});
