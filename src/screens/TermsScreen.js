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
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseView } from '../layout/BaseView';
import { constVar } from '../utils/constStr';
import { CloseIconComponent } from '../components/CloseIconComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getTerms } from '../services/MainServices';

const TermsScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const generalReducer = useSelector(state => state.generalReducer);
  const content = useSelector(state => state.contentReducer.content)
  const dispatch = useDispatch();

  useEffect(() => {
    if (generalReducer.terms === '')
      dispatch(getTerms());
  }, [])

  return (
    <BaseView
      iosBackgroundColor={'transparent'}
      showStatusBar={true}
      statusBarColor={'black'}
      removePadding={true}>
      <KeyboardAwareScrollView
        style={{
          position: 'absolute',
          flex: 1,

          width: '100%',
        }}
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
          <Text style={styles.header}>{content.termsTitle}</Text>
        </View>
        <Text style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {generalReducer.terms}
        </Text>
      </KeyboardAwareScrollView>
    </BaseView>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 23,
    marginStart: 14,
    color: 'black',
    fontWeight: 'bold',
  },

  topContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginStart: 10,
  },
});
