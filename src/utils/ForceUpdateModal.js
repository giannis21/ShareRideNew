import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import {CustomInput} from './CustomInput';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {Spacer} from '../layout/Spacer';
import {CustomIcon} from '../components/CustomIcon';
import {CustomText} from '../components/CustomText';

export function ForceUpdateModal({
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
  const {modal, container, logoStyle} = styles;

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
          <Image
            style={logoStyle}
            source={require('../assets/images/logo_transparent.png')}
          />

          <CustomIcon
            disabled
            name="download"
            type="Feather"
            size={50}
            color={'black'}
          />
          <Spacer height={24} />
          <CustomText
            type={'title1'}
            containerStyle={{marginVertical: 10}}
            text={'Ενημέρωσε την εφαρμογή για να συνεχίσεις'}
          />
          <Text style={{color: 'black', fontSize: 16}}></Text>
          <Spacer height={8} />
          <Text style={{color: 'black', fontSize: 16}}>
            {
              'Νέο update είναι διαθέσιμο. Προχώρησε με την ανανέωση έτσι ώστε να είσαι ενημερωμένος.'
            }
          </Text>

          <Spacer height={64} />

          <RoundButton
            text={'Ενημέρωση'}
            onPress={buttonPress}
            backgroundColor={colors.colorPrimary}
          />

          <Spacer height={33} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  logoStyle: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2,
  },
  topLine: {
    marginTop: 16,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    backgroundColor: 'black',
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
    height: '90%',
    paddingHorizontal: 30,

    justifyContent: 'flex-end',
  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
