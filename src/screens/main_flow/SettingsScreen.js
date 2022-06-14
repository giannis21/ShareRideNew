import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { BaseView } from '../../layout/BaseView';
import { colors } from '../../utils/Colors';
import { CustomInfoLayout } from '../../utils/CustomInfoLayout';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PictureComponent } from '../../components/PictureComponent';
import { routes } from '../../navigation/RouteNames';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';
import { resetValues } from '../../services/MainServices';
import { usePreventGoBack } from '../../customHooks/usePreventGoBack';
import { useFocusEffect } from '@react-navigation/native';
import { HorizontalLine } from '../../components/HorizontalLine';
import { CustomIcon } from '../../components/CustomIcon';
import { ViewRow } from '../../components/HOCS/ViewRow';
import { CustomText } from '../../components/CustomText';
import { constVar } from '../../utils/constStr';
import { USER_LOGOUT } from '../../actions/types';
import { InfoPopupModal } from '../../utils/InfoPopupModal';
import { useTimer } from '../../customHooks/useTimer';
const SettingsScreen = ({ navigation, route }) => {
  var _ = require('lodash');

  const dispatch = useDispatch();
  const myUser = useSelector(state => state.authReducer.user);
  const content = useSelector(state => state.contentReducer.content);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ info: '', success: false });
  const [singleFile, setSingleFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteButtonText, setDeleteButtonText] = useState(content.yesSure)
  const [startTimer, setStartTimer] = useState(false)
  let timerTime = useTimer(startTimer, false, 16);
  usePreventGoBack(goBack);

  const goBack = () => {
    navigation.goBack();
  };


  useEffect(() => {
    if (startTimer) {
      setDeleteButtonText(`${content.deleteAccountIn} ${timerTime}`)
    } else {
      setDeleteButtonText(content.yesSure)
    }

    if (timerTime === '00:00') {
      console.log("account deleted")
    }
  }, [timerTime])

  useEffect(() => {
    setSingleFile(myUser.photoProfile);
  }, [myUser.photoProfile]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, []),
  );

  const handleBackButtonClick = async () => {
    navigation.goBack();
    return true;
  };

  const goToProfile = () => {
    navigation.navigate(routes.PROFILE_STACK, {
      screen: routes.PROFILE_SCREEN,
      params: { email: myUser.email },
    });
  };

  const goToChangePass = () => {
    navigation.navigate(routes.RESTORE_PASSWORD_SCREEN, {
      email: myUser.email,
      isRestore: false,
    });
  };

  const goToContact = () => {
    navigation.navigate(routes.CONTACT_FORM_SCREEN);
  };
  const goToTerms = () => {
    navigation.navigate(routes.TERMS_SCREEN);
  };

  const goToFiltersScreen = () => {
    navigation.navigate(routes.FILTERS_SCREEN);
  };

  const onLogout = () => {
    resetValues(() => {
      dispatch({ type: USER_LOGOUT });
      navigation.navigate(routes.AUTHSTACK, { screen: routes.LOGIN_SCREEN });
    });
  };

  const onPressDelete = () => {
    setModalVisible(true)
  }
  const onModalPress = () => {
    setStartTimer(true)

  }
  const Action = ({ title, onItemPress, icon, type, containerStyle }) => {
    return (
      <TouchableOpacity
        onPress={onItemPress}
        style={[actionStyle, containerStyle]}>
        <CustomIcon
          type={type}
          style={{ alignSelf: 'center' }}
          name={icon}
          size={27}
          color={'#2175D3'}
        />
        <Text style={titleStyle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const { actionStyle, titleStyle, logoStyle, closeIconStyle } = styles;

  return (
    <BaseView
      showStatusBar={Platform.OS === 'android' ? true : false}
      statusBarColor={'black'}>
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
      <InfoPopupModal
        preventActionText={content.cancel}
        preventAction={true}
        isVisible={modalVisible}
        description={content.deleteDescription}
        buttonText={deleteButtonText}
        closeAction={() => {
          setStartTimer(false)
          setModalVisible(false);
        }}
        buttonPress={onModalPress}
        descrStyle={true}
      />
      <Image
        style={logoStyle}
        source={require('../../assets/images/logo_transparent.png')}
      />

      <CloseIconComponent containerStyle={closeIconStyle} onPress={goBack} />

      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <ViewRow style={{ alignItems: 'center' }}>
          <PictureComponent
            isLocal={true}
            singleFile={singleFile}
            imageSize={'small'}
          />

          <CustomText
            text={myUser.fullName.toUpperCase()}
            type={'settings-title'}
            containerStyle={[{ marginStart: 16 }]}
          />
        </ViewRow>
        <HorizontalLine containerStyle={{ marginVertical: 20 }} />

        <Action
          onItemPress={goToProfile}
          title={content.previewProfile}
          icon={'person'}
          type={'Fontisto'}
          containerStyle={{ marginStart: 3 }}
        />
        <Action
          onItemPress={goToChangePass}
          title={content.changePass}
          icon={'lock'}
          type={'Entypo'}
        />
        <Action
          onItemPress={goToFiltersScreen}
          title={content.filters}
          icon={'filter'}
          type={'Ionicons'}
        />

        <Action
          onItemPress={goToContact}
          title={content.contactForm}
          icon={'message'}
          type={'Entypo'}
        />
        <Action
          onItemPress={goToTerms}
          title={content.termsTitle}
          icon={'exception1'}
          type={'AntDesign'}
        />

        <HorizontalLine containerStyle={{ marginTop: 20 }} />

        <ViewRow style={{ justifyContent: 'space-between' }}>
          <CustomText
            text={'App version: 1.0.1'}
            type={'small-grey'}></CustomText>

          <TouchableOpacity
            onPress={onLogout}
            style={{
              flexDirection: 'row',
              marginTop: 1,
              alignItems: 'center',
            }}>
            <CustomIcon
              type={'AntDesign'}
              name="logout"
              color="#595959"
              size={13}
              style={{ alignSelf: 'center', marginEnd: 5 }}
            />
            <CustomText text={content.exit} type={'small-grey'}></CustomText>
          </TouchableOpacity>
        </ViewRow>

      </View>
      <Text onPress={onPressDelete} style={styles.deleteAccount}>{content.deleteAccount}</Text>
    </BaseView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  deleteAccount: {
    fontSize: 14,
    color: '#595959',
    opacity: 0.6,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    bottom: 10
  },
  titleStyle: {
    marginStart: 16,
    fontSize: 16,
    color: '#595959',
    opacity: 0.6,
  },
  actionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logoStyle: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? -30 : -60,
  },
  closeIconStyle: {
    position: 'absolute',
    marginTop: 10,
    marginStart: 10,
    justifyContent: 'space-around',
  },
});
