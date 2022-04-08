import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { CustomInput } from './CustomInput';
import { colors } from './Colors';
import { RoundButton } from '../Buttons/RoundButton';
import { Spacer } from '../layout/Spacer';
import Feather from 'react-native-vector-icons/Feather';
export function CustomInfoLayout({
  title,
  icon,
  isVisible,
  success
}) {
  const { modal, container } = styles;
  const selectedColor = success ? colors.infoGreen : colors.LightRed

  return (

    <Modal
      style={modal}
      visible={isVisible}
      transparent={true}
    >
      <View style={[container, { backgroundColor: selectedColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'white', alignSelf: 'center', flexWrap: 'wrap', width: '88%' }}>{title}</Text>
          <Feather style={{ alignSelf: 'center' }} name={icon} size={20} color='white' />
        </View>

      </View>
    </Modal>

  );
}

const styles = StyleSheet.create({
  topLine: {
    marginTop: 16,

    width: 60,
    backgroundColor: 'black',
    borderRadius: 26,
    height: 4,

  },
  modal: {
    justifyContent: 'flex-end',
    marginBottom: 20

  },
  container: {

    borderRadius: 14,
    height: 'auto',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 15,

  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center'
  }
});
