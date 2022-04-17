import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Platform, TextInput} from 'react-native';

import _, {rest} from 'lodash';
import {colors} from '../utils/Colors';

export function CustomOtpRightToLeft({onCodeChanged, restore}) {
  let list = ['-', '-', '-', '-'];
  const lengthArray = 3;

  const [listData, setListData] = useState(list);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (restore) {
      setCurrentText('');
      setListData(list);
    } else restore = false;
  }, [restore]);

  const onChangeText = value => {
    setCurrentText(value);
    let tempList = [];
    list = ['-', '-', '-', '-'];
    tempList = value.split('').reverse();

    for (var i = 0; i <= tempList.length - 1; i++) {
      if (lengthArray - i < 0) return;

      list[lengthArray - i] = tempList[i];
    }
    setListData(list);
    let newList = list.map(item => (item === '-' ? '' : item));
    onCodeChanged(newList.join(''));
  };

  const isColorBlack = index => {
    if (listData[index] !== '0') return true;

    let currentTextList = ['-', '-', '-', '-'];

    let counter = 0;
    for (var i = currentTextList.length - 1; i >= 0; i--) {
      currentTextList[i] = currentText.charAt(
        currentText.length - 1 - counter++,
      );
    }

    for (var i = 0; i <= currentTextList.length - 1; i++) {
      if (index === i && currentTextList[i] === '') {
        return false;
      }
    }

    return true;
  };

  const {container, otpView, focusedInputField} = styles;
  return (
    <View style={container}>
      {listData.map((item, index) => {
        return (
          <View
            style={[
              otpView,
              index === lengthArray ? focusedInputField : {marginRight: 10},
            ]}>
            {index === lengthArray ? (
              <View>
                <Text
                  color={listData[index] === '-' ? colors.CoolGray2 : 'black'}>
                  {' '}
                  {listData[index]}
                </Text>
                <View style={{position: 'absolute'}}>
                  <TextInput
                    style={{marginTop: Platform.OS === 'android' ? -12 : 0}}
                    color={'transparent'}
                    width={14}
                    caretHidden={currentText === '' ? false : true}
                    autoFocus={true}
                    keyboardType={'numeric'}
                    onChangeText={onChangeText}
                    value={currentText}
                    maxLength={4}
                  />
                </View>
              </View>
            ) : (
              <Text
                color={listData[index] === '-' ? colors.CoolGray2 : 'black'}>
                {' '}
                {listData[index]}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  otpView: {
    height: 54,
    width: 52,
    backgroundColor: colors.grey100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey200,
  },
  // CONTAINER
  inputContainer: {
    height: 54,
    width: 52,
    backgroundColor: colors.grey100,
    borderRadius: 8,
  },

  // INPUT
  inputField: {
    height: 52,
    width: 49,
    backgroundColor: colors.grey100,
    borderRadius: 8,
    color: colors.basicBlack,
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  focusedInputField: {
    borderWidth: 1,
    borderColor: colors.colorPrimary,
    borderRadius: 8,
  },
});
