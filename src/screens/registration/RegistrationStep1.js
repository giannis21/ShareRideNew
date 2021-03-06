import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Image,
  InteractionManager,
  PermissionsAndroid,
  Dimensions,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { regex } from '../../utils/Regex';
import { routes } from '../../navigation/RouteNames';
import Tooltip from '../../components/tooltip/Tooltip';
import { useSelector } from 'react-redux';
let paddingHorizontal = 16;
const RegistrationStep1 = ({ navigation }) => {
  var _ = require('lodash');

  const content = useSelector(state => state.contentReducer.content);

  const { width } = Dimensions.get('screen');
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    content.selectAge,
  );

  let initalData = {
    fullName: '',
    phone: '',
    age: '',
  };

  const [data, setData] = useState(initalData);

  const onFullNameChanged = value => {
    setData({ ...data, fullName: value });
  };

  const onPhoneChanged = value => {
    setData({ ...data, phone: value });
  };

  const openPicker = option => {
    if (option === 1) {
      setPickerData(range(18, 70));
      setDataSlotPickerTitle(content.selectAge);
      setDataSlotPickerVisible(true);
    }
  };
  const validFields = () => {
    return (
      data.fullName.length >= 3 &&
      regex.phoneNumber.test(data.phone) &&
      data.age !== ''
    );
  };


  const toggleTooltip = () => {
    tooltipRef.current.toggleTooltip();
  };

  const goBack = () => {
    navigation.goBack();
  };
  const goToStep2 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_2, { registerData: data });
  };

  const tooltipRef = useRef(null);

  return (
    <BaseView
      removePadding
      addStyleDynamically
      statusBarColor={'white'}
      translucent={false}
      light={false}
      barStyle="dark-content"
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ProgressStepBar step={1} />
      <CloseIconComponent
        onPress={goBack}
        containerStyle={{ marginStart: 10, marginTop: 10 }}
      />

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{ paddingHorizontal: paddingHorizontal }}>
          <Spacer height={25} />
          <CustomInput
            text={content.fullName}
            keyboardType="default"
            onChangeText={onFullNameChanged}
            value={data.fullName}
          />
          <Spacer height={5} />

          <Tooltip
            disabled={true}
            ref={tooltipRef}
            width={width / 1.2}
            height={'auto'}
            skipAndroidStatusBar={true}
            backgroundColor={colors.colorPrimary}
            withOverlay={true}
            pointerColor={colors.colorPrimary}
            toggleOnPress={false}
            triangleOffset={16 + 7}
            trianglePosition="right"
            popover={
              <Text style={{ color: 'white' }}>{content.tooltipPhoneText}</Text>
            }>
            <View>
              <CustomInput
                onIconPressed={toggleTooltip}
                text={content.phone}
                errorText={content.phoneIncorrect}
                isError={
                  !regex.phoneNumber.test(data.phone) && data.phone !== ''
                }
                keyboardType="numeric"
                onChangeText={onPhoneChanged}
                hasIcon={true}
                icon={'info'}
                value={data.phone}
              />
            </View>
          </Tooltip>
          <Spacer height={5} />
          <CustomInput
            onPressIn={() => {
              openPicker(1);
            }}

            hasBottomArrow={true}
            disabled={true}
            text={content.age}
            value={data.age}
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
          setData({ ...data, age: selectedValue.toString() });
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
        text={'????????????????'}
        onPress={goToStep2}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep1;

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
