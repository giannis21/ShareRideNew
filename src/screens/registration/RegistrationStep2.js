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
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProgressStepBar } from '../../components/ProgressStepBar';
import { BaseView } from '../../layout/BaseView';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { constVar } from '../../utils/constStr';
import { Spacer } from '../../layout/Spacer';
import { RoundButton } from '../../Buttons/RoundButton';
import { colors } from '../../utils/Colors';
import { routes } from '../../navigation/RouteNames';
import { CustomText } from '../../components/CustomText';
import { useSelector } from 'react-redux';

const RegistrationStep2 = ({ navigation, route }) => {
  var _ = require('lodash');
  const content = useSelector(state => state.contentReducer.content);

  const { registerData } = route.params;
  const [selectedGender, setSelectedGender] = useState(null);
  const goBack = () => {
    navigation.goBack();
  };
  const goToStep3 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_3, {
      registerData: { ...registerData, gender: selectedGender },
    });
  };
  const { genderContainer } = styles;
  return (
    <BaseView
      addStyleDynamically
      statusBarColor={'white'}
      barStyle="dark-content"
      removePadding={true}>
      <ProgressStepBar step={2} />

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
          <CustomText text={content.myGenreIs} type="title0" />

          <Spacer height={Dimensions.get('window').height / 4} />

          <TouchableOpacity
            activeOpacity={1}
            style={[
              genderContainer,
              {
                borderColor:
                  selectedGender === 'male'
                    ? colors.colorPrimary
                    : colors.grey400,
                justifyContent: 'center',
              },
            ]}
            onPress={() => {
              setSelectedGender('male');
            }}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  selectedGender === 'male'
                    ? colors.colorPrimary
                    : colors.title_grey,
              }}>
              {content.man}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={[
              genderContainer,
              {
                borderColor:
                  selectedGender === 'female'
                    ? colors.colorPrimary
                    : colors.grey400,
                marginTop: 20,
              },
            ]}
            onPress={() => {
              setSelectedGender('female');
            }}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  selectedGender === 'female'
                    ? colors.colorPrimary
                    : colors.title_grey,
              }}>
              {content.woman}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <RoundButton
        disabled={selectedGender === null}
        containerStyle={{
          marginHorizontal: 16,
          marginBottom: 16,
        }}
        text={content.continue}
        onPress={goToStep3}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default RegistrationStep2;

const styles = StyleSheet.create({
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
