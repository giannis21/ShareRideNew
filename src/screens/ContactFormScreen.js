import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Keyboard,
  Dimensions,
  Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseView } from '../layout/BaseView';
import { RoundButton } from '../Buttons/RoundButton';
import { colors } from '../utils/Colors';
import { Loader } from '../utils/Loader';
import { CloseIconComponent } from '../components/CloseIconComponent';
import { CommentInputComponent } from '../components/CommentInputComponent';
import { Paragraph } from '../components/HOCS/Paragraph';
import { sendReport } from '../services/MainServices';
import { CustomText } from '../components/CustomText';
import { openComposer } from 'react-native-email-link';
import { useSelector } from 'react-redux';
import { showToast } from '../utils/Functions';
const ContactFormScreen = ({ navigation, route }) => {
  var _ = require('lodash');

  const { height } = Dimensions.get('window');

  const content = useSelector(state => state.contentReducer.content);


  const [isLoading, setIsLoading] = React.useState(false);
  const [comment, setComment] = useState('');


  const errorCallback = message => {
    showToast(message, false)
  };

  const handleEmailSending = () => {
    openComposer({
      to: 'support@example.com',
      subject: 'I have a question',
      body: 'Hi, can you help me with...',
    });
  };

  const sendFeedBack = () => {
    sendReport({
      text: comment,
      successCallback: message => {
        showToast(message)
        setTimeout(() => {
          navigation.goBack();
        }, 3000);

      },
      errorCallback: errorMessage => {
        showToast(errorMessage, false)
      },
    });
  };

  return (
    <BaseView
      iosBackgroundColor={'transparent'}
      showStatusBar={true}
      statusBarColor={'black'}
      removePadding={true}>
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
        }}>
        <Loader isLoading={isLoading} />

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
              containerStyle={{ marginStart: 14 }}
              text={content.contactForm}
            />
          </View>

          <CommentInputComponent
            placeholder={content.contactInputPLaceholder}
            removeNote={true}
            extraStyle={{ height: height / 3.5 }}
            onChangeText={val => setComment(val)}
          />

          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 15, color: '#595959', marginVertical: 10 }}>
              {content.or}
            </Text>

            <Paragraph>
              <Text style={{ fontSize: 15, color: 'black' }}>
                {content.sendUs}
              </Text>
              <CustomText
                color="black"
                type={'underline-bold'}
                onPress={handleEmailSending}
                text={content.here}
              />
            </Paragraph>
          </View>
        </KeyboardAwareScrollView>

        <RoundButton
          disabled={_.isEmpty(comment)}
          containerStyle={{
            marginHorizontal: 10,
            marginTop: 30,
          }}
          text={content.send}
          onPress={sendFeedBack}
          backgroundColor={colors.colorPrimary}
        />
      </View>
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
