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
    <View>
      {isVisible ? (
        <View style={[container, { backgroundColor: selectedColor }]} >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', alignSelf: 'center', flexWrap: 'wrap', width: '88%' }}>{title}</Text>
            <Feather style={{ alignSelf: 'center' }} name={icon} size={20} color='white' />
          </View>

        </View>
      ) : null}
    </View>


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

  container: {
    justifyContent: 'flex-end',
    // bottom: 110,
    zIndex: 1,
    margin: 10,
    borderRadius: 14,
    height: 'auto',
    padding: 15,
    position: 'absolute',

    elevation: 3

  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center'
  }
});
