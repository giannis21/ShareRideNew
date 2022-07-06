import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { InfoPopupModal } from '../utils/InfoPopupModal';
import { Spacer } from '../layout/Spacer';
import Feather from 'react-native-vector-icons/Feather';
import { Loader } from '../utils/Loader';
import { BaseView } from '../layout/BaseView';
import { colors } from '../utils/Colors';
import { useTimer } from '../customHooks/useTimer';
import { forgotPass, registerUser } from '../services/AuthServices';
import { routes } from '../navigation/RouteNames';
import { constVar } from '../utils/constStr';
import { CustomOtpRightToLeft } from '../components/CustomOtpRightToLeft';
import { Paragraph } from '../components/HOCS/Paragraph';
import { ProgressStepBar } from '../components/ProgressStepBar';
import { CloseIconComponent } from '../components/CloseIconComponent';
import { ViewRow } from '../components/HOCS/ViewRow';
import RNFetchBlob from 'rn-fetch-blob';
import { useSelector } from 'react-redux';
import { showToast } from '../utils/Functions';

const OtpScreen = ({ navigation, route }) => {
  const content = useSelector(state => state.contentReducer.content);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [showTextError, setShowTextError] = useState(false);
  const { _otp, _email, goToRestore } = route.params;
  const [refreshTimer, setRefreshTimer] = useState(false);

  const [otp, setOtp] = useState(_otp);
  const [email, setEmail] = useState(_email);

  let timerTime = useTimer(true, refreshTimer);

  useEffect(() => {
    sendOtp();
  }, []);

  const register = () => {
    let registerData = route.params.registerData;

    let dataToSave = {
      ...registerData,
    };

    if (dataToSave.carBrand === '-') dataToSave.carBrand = null;
    if (dataToSave.carDate === '-') dataToSave.carDate = null;
    setIsLoading(true);
    registerUser(
      dataToSave,

      //success callback
      (message, otp) => {
        storeImageLocally();
        showToast(message)
        setIsLoading(false);
        setTimeout(() => {

          navigation.navigate(routes.LOGIN_SCREEN, {
            message: message ?? constVar.emailApproved,
          });
        }, 2000);

      },

      //error callback
      (error, code) => {
        setIsLoading(false);
        showToast(error, false)
        setTimeout(() => {
          if (code === 405) {
            navigation.goBack();
          }
        }, 2000);

      },
    );
  };
  const storeImageLocally = async () => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DocumentDir}/images/${route.params.registerData.email}.png`;
      const data = await RNFetchBlob.fs.writeFile(
        path,
        singleFile.data,
        'base64',
      );
      setSingleFile(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const goToRestoreScreen = () => {
    navigation.navigate(routes.RESTORE_PASSWORD_SCREEN, {
      email: _email,
      isRestore: true,
      userLoggedOut: true,
    });
  };

  const onConfirm = code => {
    if (timerTime == '00:00') {
      setShowTextError(true);
      return;
    }

    if (code === otp) {
      if (goToRestore) {
        goToRestoreScreen();
      } else {
        register();
      }
    } else {
      setTimeout(function () {
        setShowTextError(true);
        setCode('');
      }, 300);
    }
  };

  const forgotPassSuccessCallback = (_otp, _email, message) => {
    console.log('otp is ', _otp);
    showToast(message)
    setIsLoading(false);
    setTimeout(function () {
      setShowTextError(false);
      setCode('');
    }, 300);

    setRefreshTimer(!refreshTimer);
    setOtp(_otp);
  };

  const forgotPassErrorCallback = message => {
    showToast(message, false)
    setIsLoading(false);
    setCode('');
  };

  const sendOtp = () => {
    setIsLoading(true);
    forgotPass({
      email: _email,
      successCallBack: forgotPassSuccessCallback,
      errorCallback: forgotPassErrorCallback,
    });
  };



  return (

    <BaseView removePadding={true} barStyle="dark-content" statusBarColor={'transparent'}>
      {route.params?.showProgressBar && <ProgressStepBar step={6} />}
      <Loader isLoading={isLoading} />


      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ViewRow style={{ alignItems: 'center' }}>
          <CloseIconComponent
            showArrow={true}
            onPress={() => {
              navigation.goBack();
            }}
            containerStyle={{ marginStart: 10, marginTop: 10 }}
          />
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.header}>{content.goConfirm}</Text>
          </View>
          <Text textAlign="center"></Text>
        </ViewRow>

        <Spacer height={65} />

        <View style={{ alignItems: 'center' }}>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{timerTime}</Text>
          </View>

          <Spacer height={45} />
          <Paragraph marginHorizontal={20} textAlign={'center'} color="black">
            <Text style={{ fontSize: 16 }}>{content.receiveOtp}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`${email}.`} </Text>
            <Text style={{ fontSize: 16 }}>{content.writeOtp}</Text>
          </Paragraph>

          <Spacer height={25} />
          <CustomOtpRightToLeft
            restore={code === ''}
            onCodeChanged={code => {
              if (showTextError) {
                setShowTextError(false);
              }
              setCode(code);
              if (code.length === 4) {
                onConfirm(code);
              }
            }}
          />

          {showTextError && (
            <Text style={styles.wrongPass}>{content.expiredPass}</Text>
          )}

          <Spacer height={50} />
          <Text
            style={{
              fontSize: 16,
              paddingHorizontal: 22,
              alignSelf: 'center',
              textAlign: 'center',
              color: 'black',
              //fontWeight: '900',
            }}>
            {content.checkEmail}
          </Text>
          <Spacer height={30} />

          <TouchableWithoutFeedback onPress={sendOtp}>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 22,
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'black',
              }}>
              {content.retry}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </BaseView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  timer: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
    color: 'black',
  },
  timerContainer: {
    backgroundColor: 'white',
    height: 'auto',
    width: '100%',
    borderRadius: 23,
  },
  header: {
    fontSize: 23,
    marginStart: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  wrongPass: {
    fontSize: 13,
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    color: 'red',
  },
  topContainer: {
    flexDirection: 'row',
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  absolute: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    top: 0,
  },
  box: {
    width: 55,
    alignSelf: 'center',

    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 8,
    color: 'black',
  },
});
