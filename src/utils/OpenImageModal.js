import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { CustomInput } from './CustomInput';
import { colors } from './Colors';
import { RoundButton } from '../Buttons/RoundButton';
import { Spacer } from '../layout/Spacer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { postExistsInFav } from '../customSelectors/PostsSelectors';
import { HorizontalLine } from '../components/HorizontalLine';

export function OpenImageModal({
  closeAction,
  buttonPress,
  isVisible,
  isPost,
  isFavoritePostScreen,
  postId,
}) {
  const { modal, container, textStyle } = styles;

  const postExists = useSelector(postExistsInFav(postId));
  const content = useSelector(state => state.contentReducer.content);

  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={modal}
        onBackdropPress={closeAction}
        onSwipeComplete={closeAction}
        swipeDirection="down"
        useNativeDriver={true}>
        {!isPost && (
          <View style={container}>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => {
                buttonPress(0);
              }}>

              <Text style={textStyle}>{content.takePhoto}</Text>
            </TouchableOpacity>

            <HorizontalLine />
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => buttonPress(1)}>
              <Text style={textStyle}>{content.choosePhoto}</Text>
            </TouchableOpacity>
          </View>
        )}
        {isPost && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[{ padding: 10 }, container]}
            onPress={() => buttonPress(1)}>
            <Text
              style={[
                textStyle,
                { color: postExists || isFavoritePostScreen ? 'red' : 'black' },
              ]}>
              {postExists || isFavoritePostScreen
                ? content.removeFromFavs
                : content.addToFavs}
            </Text>
          </TouchableOpacity>
        )}

        <Spacer height={10} />
        <TouchableOpacity
          activeOpacity={0.9}
          style={[{ padding: 10 }, container]}
          onPress={() => buttonPress(2)}>
          <Text style={[textStyle, { color: 'red' }]}>{content.delete}</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 10,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 'auto',
    paddingHorizontal: 10,
  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
