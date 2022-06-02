import {Modal, Text, View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Spacer} from '../layout/Spacer';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {CustomInput} from './CustomInput';
import {StarsRating} from './StarsRating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CommentInputComponent} from '../components/CommentInputComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

export const RatingDialog = ({
  isVisible,
  closeAction,
  onSubmit,
  editReview,
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
      <SafeAreaView style={container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.colorPrimary,
          }}>
          <Text
            style={{
              padding: 3,
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
              padding: 9,
            }}>
            {editReview ? 'Ενημέρωση αξιολόγησης χρήστη' : 'Αξιολόγηση χρήστη'}
          </Text>
          <MaterialIcons
            name="rate-review"
            color="white"
            size={23}
            style={{alignSelf: 'center', marginEnd: 5}}
          />
        </View>

        <Spacer height={40} />

        <View style={{alignItems: 'center'}}>
          <StarsRating setRating={rating => setCurrentRating(rating)} />
        </View>

        <CommentInputComponent
          extraStyle={{}}
          onChangeText={val => setComment(val)}
        />
        <Spacer height={44} />

        <View style={styles.buttonContainer}>
          <RoundButton
            containerStyle={{
              paddingHorizontal: 40,
              borderRadius: 13,
              transform: [
                {
                  translateY: 20,
                },
              ],
            }}
            text={'Ακύρωση'}
            onPress={closeAction}
            backgroundColor={colors.colorPrimary}
          />
          <RoundButton
            disabled={rating === 0 || comment === ''}
            containerStyle={{
              paddingHorizontal: 40,
              borderRadius: 13,
              transform: [
                {
                  translateY: 20,
                },
              ],
            }}
            text={'Υποβολή'}
            onPress={() => (rating === 0 ? null : onSubmit(rating, comment))}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </SafeAreaView>
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
    backgroundColor: 'white',
    borderRadius: 24,
    height: 'auto',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // maxHeight: Dimensions.get('window').height - 100,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: Platform.OS === 'android' ? 20 : 70,
  },
  descriptionStyle: {
    paddingVertical: 32,
    textAlign: 'center',
  },
});
