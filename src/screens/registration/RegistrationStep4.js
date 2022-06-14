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

import { check } from 'react-native-permissions';
import { ProgressStepBar } from '../../components/ProgressStepBar';
import { BaseView } from '../../layout/BaseView';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { constVar } from '../../utils/constStr';
import { Spacer } from '../../layout/Spacer';
import { DataSlotPickerModal } from '../../utils/DataSlotPickerModal';
import { RoundButton } from '../../Buttons/RoundButton';
import { colors } from '../../utils/Colors';
import { routes } from '../../navigation/RouteNames';
import { PictureComponent } from '../../components/PictureComponent';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { onLaunchCamera, onLaunchGallery } from '../../utils/Functions';
import { CustomText } from '../../components/CustomText';
import { useSelector } from 'react-redux';

const RegistrationStep4 = ({ navigation, route }) => {
  var _ = require('lodash');

  const content = useSelector(state => state.contentReducer.content);

  const [singleFile, setSingleFile] = useState(null);
  const { registerData } = route.params;
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );

  console.log({ registerData });
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

  const onImageClick = () => {
    if (Platform.OS === 'android') {
      requestAndroidPermission();
    } else {
      setIsModalVisible(true);
    }
  };

  const onActionSheet = index => {
    if (Platform.OS === 'android')
      requestAndroidPermission(val => {
        if (val) {
          callActionsModal(index);
        }
      });
    else {
      callActionsModal(index);
    }
  };

  const callActionsModal = index => {
    switch (index) {
      case 0:
        return onLaunchCamera(data => {
          setIsModalVisible(false);
          if (data !== 'error') setSingleFile(data);
          setSingleFile(data);
        });
      case 1:
        return onLaunchGallery(data => {
          setIsModalVisible(false);
          if (data !== 'error') setSingleFile(data);
          setSingleFile(data);
        });
      case 2: {
        setSingleFile(null);
        return null;
      }
    }
  };
  const requestAndroidPermission = async callback => {
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (readGranted) {
      callback(true);
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };
  const requestAndroidPermission1 = callback => {
    check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case PermissionsAndroid.RESULTS.GRANTED: {
            callback(true);
          }

          default:
            callback(false);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const goBack = () => {
    navigation.goBack();
  };
  const goToStep5 = () => {
    navigation.navigate(routes.REGISTER_SCREEN_STEP_5, {
      registerData: { ...registerData, photo: singleFile?.data },
    });
  };
  return (
    <BaseView
      removePadding={true}
      statusBarColor={'white'}
      barStyle="dark-content">
      <ProgressStepBar step={4} />

      <CloseIconComponent
        showArrow={true}
        onPress={goBack}
        containerStyle={{ marginStart: 10, marginTop: 10 }}
      />

      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <Spacer height={25} />
        <CustomText text={content.imageProfile} type="title0" />

        <Text style={{ color: colors.subtitleColor, marginTop: 5 }}>
          {content.choosePhotoRegister}
        </Text>
        <Spacer height={35} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: Platform.OS === 'android' ? 35 : 0,
          }}>
          <PictureComponent
            singleFile={singleFile}
            openCamera={true}
            onCameraPress={() => setIsModalVisible(true)}
            imageSize={'big'}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <RoundButton
            disabled={singleFile === null}
            containerStyle={{
              marginBottom: 16,
            }}
            text={content.continue}
            onPress={goToStep5}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </View>

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
      <OpenImageModal
        isVisible={isModalVisible}
        closeAction={() => {
          setIsModalVisible(false);
        }}
        buttonPress={index => {
          onActionSheet(index);
        }}
      />
    </BaseView>
  );
};

export default RegistrationStep4;

const styles = StyleSheet.create({});
