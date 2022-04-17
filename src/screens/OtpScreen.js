import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {InfoPopupModal} from '../utils/InfoPopupModal';
import {Spacer} from '../layout/Spacer';
import Feather from 'react-native-vector-icons/Feather';
import {Loader} from '../utils/Loader';
import {BaseView} from '../layout/BaseView';
import {colors} from '../utils/Colors';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {useTimer} from '../customHooks/useTimer';
import {forgotPass} from '../services/AuthServices';
import {routes} from '../navigation/RouteNames';
import {constVar} from '../utils/constStr';
import {verifyUser} from '../services/MainServices';
import {CustomOtpRightToLeft} from '../components/CustomOtpRightToLeft';
import {Paragraph} from '../components/HOCS/Paragraph';

const OtpScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalInput, setModalInput] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [showTextError, setShowTextError] = React.useState(false);
  const {_otp, _email, goToRestore} = route.params;
  const [refreshTimer, setRefreshTimer] = React.useState(false);

  const [otp, setOtp] = React.useState(_otp);
  const [email, setEmail] = React.useState(_email);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  let timerTime = useTimer(true, refreshTimer);

  const modalInputChange = value => {
    setModalInput(value);
  };

  const onConfirm = code => {
    if (timerTime == '00:00') {
      setShowTextError(true);
      return;
    }

    if (code === otp) {
      verifyUser({
        email,
        successCallback: message => {
          if (goToRestore)
            navigation.navigate(routes.RESTORE_PASSWORD_SCREEN, {
              email: email,
              isRestore: true,
            });
          else
            navigation.navigate(routes.LOGIN_SCREEN, {
              message: message ?? constVar.emailApproved,
            });
        },

        errorCallback: message => {
          setHasErrors(true);
          setIsLoading(false);
          setMessage(message);
          showCustomLayout();
        },
      });
    } else {
      setTimeout(function () {
        setShowTextError(true);
        setCode('');
      }, 300);
    }
  };

  const forgotPassSuccessCallback = (_otp, _email, message) => {
    setMessage(message);
    showCustomLayout();
    setIsLoading(false);
    setTimeout(function () {
      setShowTextError(false);
      setCode('');
    }, 300);
    console.log('otp is ', _otp);
    setRefreshTimer(!refreshTimer);
    setOtp(_otp);
    setHasErrors(false);
  };

  const forgotPassErrorCallback = message => {
    setHasErrors(true);
    setIsLoading(false);
    setMessage(message);
    setCode('');
    showCustomLayout();
  };
  const modalSubmit = () => {};
  const retry = () => {
    setIsLoading(true);
    forgotPass({
      email: _email,
      successCallBack: forgotPassSuccessCallback,
      errorCallback: forgotPassErrorCallback,
    });
  };

  const showCustomLayout = () => {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
    }, 3000);
  };

  return (
    <BaseView statusBarColor={colors.colorPrimary}>
      <Loader isLoading={isLoading} />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={message}
        icon={hasErrors ? 'x-circle' : 'check-circle'}
        success={!hasErrors}
      />

      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={styles.topContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}>
            <Feather
              style={{alignSelf: 'flex-start'}}
              name="chevron-left"
              size={30}
              color="black"
            />
          </TouchableWithoutFeedback>

          <Text style={styles.header}>{constVar.goConfirm}</Text>
        </View>

        <Spacer height={65} />

        <View style={{alignItems: 'center'}}>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>{timerTime}</Text>
          </View>

          <Spacer height={45} />
          <Paragraph textAlign={'center'} color="black">
            <Text style={{fontSize: 16}}> Έλαβες έναν 4-ψήφιο κωδικό στο </Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{email} </Text>
            <Text style={{fontSize: 16}}>Πληκτρολόγησέ τον εδώ:</Text>
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
            <Text style={styles.wrongPass}>{constVar.expiredPass}</Text>
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
            {constVar.checkEmail}
          </Text>
          <Spacer height={30} />

          <TouchableWithoutFeedback onPress={retry}>
            <Text
              style={{
                fontSize: 16,
                paddingHorizontal: 22,
                alignSelf: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'black',
              }}>
              {constVar.retry}
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
    alignSelf: 'center',
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
    marginTop: 16,
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
