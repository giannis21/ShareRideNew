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
import { CustomInfoLayout } from '../../utils/CustomInfoLayout';
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
import { PictureComponent } from '../../components/PictureComponent';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { onLaunchCamera, onLaunchGallery } from '../../utils/Functions';

const RegistrationStep4 = ({ navigation, route }) => {
  var _ = require('lodash');
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
            console.log('permissions granted');
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
    <BaseView removePadding={true} statusBarColor={'white'} barStyle='dark-content'>
      <ProgressStepBar step={4} />

      <CloseIconComponent
        onPress={goBack}
        containerStyle={{ marginStart: 10, marginTop: 10 }}
      />

      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <Spacer height={25} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
          }}>
          Εικόνα προφίλ
        </Text>
        <Text style={{ color: '#8b9cb5', marginTop: 5 }}>
          Μπορείς να επιλέξεις απο το κινητό σου, η να τραβήξεις με την κάμερα
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
            onPress={() => setIsModalVisible(true)}
            imageSize={'big'}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <RoundButton
            disabled={singleFile === null}
            containerStyle={{
              marginBottom: 16,
            }}
            text={'Συνέχεια'}
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
