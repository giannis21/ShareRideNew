import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Keyboard,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BaseView} from '../layout/BaseView';
import {Spacer} from '../layout/Spacer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {RoundButton} from '../Buttons/RoundButton';
import {colors} from '../utils/Colors';
import {routes} from '../navigation/RouteNames';
import {createToken, restorePassword} from '../services/AuthServices';
import {Loader} from '../utils/Loader';
import {CustomInput} from '../utils/CustomInput';
import {InfoPopupModal} from '../utils/InfoPopupModal';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {getValue, setValue} from '../utils/Storage';
import {constVar} from '../utils/constStr';
import {CloseIconComponent} from '../components/CloseIconComponent';
import {CommentInputComponent} from '../components/CommentInputComponent';
import {Paragraph} from '../components/HOCS/Paragraph';
import {sendEmail} from '../utils/Functions';
import {sendReport} from '../services/MainServices';
import {CustomText} from '../components/CustomText';
const ContactFormScreen = ({navigation, route}) => {
  var _ = require('lodash');

  const {height} = Dimensions.get('window');

  const [isLoading, setIsLoading] = React.useState(false);
  const [showInfoModal, setShowInfoModal] = React.useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [comment, setComment] = useState('');

  function showCustomLayout(callback) {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 3000);
  }

  const errorCallback = message => {
    setInfoMessage({hasError: true, message});
    showCustomLayout();
  };

  const handleEmailSending = () => {
    sendEmail(
      'giannisfragoulis21@gmail.com',
      'Θέμα',
      'I think you are fucked up how many letters you get.',
    ).then(() => {
      console.log('Our email successful provided to device mail ');
    });
  };

  const sendFeedBack = () => {
    sendReport({
      text: comment,
      successCallback: message => {
        setInfoMessage({info: message, success: true});
        showCustomLayout(() => {
          navigation.goBack();
        });
      },
      errorCallback: errorMessage => {
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  return (
    <BaseView statusBarColor={colors.colorPrimary} removePadding>
      <Loader isLoading={isLoading} />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.topContainer}>
          <CloseIconComponent
            onPress={() => {
              navigation.goBack();
            }}
          />

          <CustomText
            type={'header'}
            containerStyle={{marginStart: 14}}
            text={constVar.contactForm}
          />
        </View>

        <CommentInputComponent
          placeholder={constVar.contactInputPLaceholder}
          removeNote={true}
          extraStyle={{height: height / 3.5}}
          onChangeText={val => setComment(val)}
        />

        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 15, color: '#595959', marginVertical: 10}}>
            ή
          </Text>

          <Paragraph>
            <Text style={{fontSize: 15}}>στείλε μας email </Text>
            <CustomText
              type={'underline-bold'}
              onPress={handleEmailSending}
              text="εδώ"
            />
          </Paragraph>
        </View>
      </KeyboardAwareScrollView>

      <RoundButton
        disabled={_.isEmpty(comment)}
        containerStyle={{bottom: 10, marginHorizontal: 10}}
        text={'Αποστολή'}
        onPress={sendFeedBack}
        backgroundColor={colors.colorPrimary}
      />
    </BaseView>
  );
};

export default ContactFormScreen;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginStart: 10,
  },
});
