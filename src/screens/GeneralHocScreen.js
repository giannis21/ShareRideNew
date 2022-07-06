import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';

import { colors } from '../utils/Colors';
import { getIsHocScreenActive } from '../customSelectors/GeneralSelectors';
import { closeHoc, setActiveNotification } from '../actions/actions';

const GeneralHocScreen = ({ navigation }) => {
  var _ = require('lodash');

  const [backgroundColor, setBackgroundColor] = useState('transparent');

  let dispatch = useDispatch();
  const generalReducer = useSelector(state => state.generalReducer);
  const isScreenActive = useSelector(getIsHocScreenActive);

  useEffect(() => {
    if (isScreenActive)
      setTimeout(() => {
        console.log(generalReducer?.notificationObject);
        setBackgroundColor('rgba(0,0,0,0.15)');
      }, 600);
    else {
      setBackgroundColor('transparent');
    }
  }, [isScreenActive]);

  const { container } = styles;
  return (
    <SafeAreaView
      style={{
        backgroundColor: backgroundColor,
        flex: 1,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          dispatch(setActiveNotification(true));
          dispatch(closeHoc());
        }}
        style={container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.colorPrimary,
          }}>
          <Text
            style={{
              padding: 3,
              paddingStart: 3,
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {generalReducer?.notificationObject?.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(setActiveNotification(false));
              dispatch(closeHoc());
            }}
            style={styles.circle}>
            <MaterialCommunityIcons name={'close'} size={21} color={'black'} />
          </TouchableOpacity>
        </View>
        <Text style={{ padding: 15 }}>
          {generalReducer?.notificationObject?.message}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GeneralHocScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modal: {},
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    height: 'auto',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    marginHorizontal: 10,
    marginTop: 12,
  },
  circle: {
    borderRadius: 100 / 2,
    backgroundColor: 'white',
    borderWidth: 0.4,
    position: 'absolute',
    justifyContent: 'flex-end',
    right: 0,
    transform: [{ translateX: 6 }, { translateY: -6 }],
    padding: 10,
  },
  descriptionStyle: {
    paddingVertical: 32,
    textAlign: 'center',
  },
});
