import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import {CustomInput} from './CustomInput';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {Spacer} from '../layout/Spacer';

export function InfoPopupModal({
  closeAction,
  title,
  titleType,
  description,
  buttonText,
  closeText,
  buttonPress,
  isVisible,
  descrStyle,
  onChangeText,
  preventAction,
  preventActionText,
}) {
  const {modal, container} = styles;

  return (
    <View>
      <Modal
        avoidKeyboard
        isVisible={isVisible}
        style={modal}
        onBackdropPress={closeAction}
        onSwipeComplete={closeAction}
        swipeDirection="down"
        useNativeDriver={true}>
        <View style={container}>
          <View style={styles.topLine} />
          <Spacer height={20} />
          <Text
            style={{alignSelf: 'center', textAlign: 'center', color: 'black'}}>
            {description}
          </Text>
          {!preventAction && (
            <CustomInput
              text="εδώ, δίνεις το email σου"
              keyboardType="email-address"
              returnKeyType={'go'}
              onChangeText={onChangeText}
            />
          )}
          <Spacer height={16} />

          <RoundButton
            text={buttonText}
            onPress={buttonPress}
            backgroundColor={colors.colorPrimary}
          />
          {preventAction && (
            <RoundButton
              containerStyle={{marginTop: 10}}
              text={preventActionText}
              textColor={colors.colorPrimary}
              onPress={closeAction}
            />
          )}
          <Spacer height={26} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topLine: {
    marginTop: 16,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    backgroundColor: colors.CoolGray1,
    borderRadius: 26,
    height: 4,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 'auto',
    paddingHorizontal: 30,
  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
