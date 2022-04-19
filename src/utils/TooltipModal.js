import {
  Modal,
  Text,
  Pressable,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Spacer} from '../layout/Spacer';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {CustomInput} from './CustomInput';
import {StarsRating} from './StarsRating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CommentInputComponent} from '../components/CommentInputComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import Triangle from '../components/Triangle';

export const TooltipModal = ({
  isVisible,
  closeAction,
  onSubmit,
  editReview,
  text,
}) => {
  const [rating, setCurrentRating] = useState(0);
  const [comment, setComment] = useState('');

  const {modal, container} = styles;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      style={[modal, {backgroundColor: 'red'}]}
      visible={isVisible}
      onRequestClose={closeAction}>
      <View style={{marginTop: Platform.OS === 'android' ? 20 : 205 + 77}}>
        <Triangle style={{alignSelf: 'flex-end', marginEnd: 16 + 4}} />
        <View style={container}>
          <Text
            style={{
              padding: 3,
              fontSize: 15,

              color: 'white',
              padding: 9,
            }}>
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modal: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    backgroundColor: 'black',
    flex: 1,

    height: '100%',
    position: 'absolute',
  },
  container: {
    backgroundColor: colors.colorPrimary,
    borderRadius: 9,

    height: 'auto',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // maxHeight: Dimensions.get('window').height - 100,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  descriptionStyle: {
    paddingVertical: 32,
    textAlign: 'center',
  },
});
