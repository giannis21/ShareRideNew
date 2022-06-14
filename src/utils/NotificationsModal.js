import {
  Modal,
  Text,
  Pressable,
  View,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Spacer } from '../layout/Spacer';
import { colors } from './Colors';
import { RoundButton } from '../Buttons/RoundButton';
import { CustomInput } from './CustomInput';
import { StarsRating } from './StarsRating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CommentInputComponent } from '../components/CommentInputComponent';

import { useSelector } from 'react-redux';
import { getUsersToRate } from '../customSelectors/GeneralSelectors';
import { UserComponent } from '../components/UserComponent';
import { CustomIcon } from '../components/CustomIcon';
import { ViewRow } from '../components/HOCS/ViewRow';
import { constVar } from './constStr';
var _ = require('lodash');
export const NotificationsModal = ({
  isVisible,
  closeAction,
  onSubmit,
  onProfileClick,
}) => {
  const [rating, setCurrentRating] = useState(0);
  const [comment, setComment] = useState('');
  let usersToRate = useSelector(getUsersToRate);
  const content = useSelector(state => state.contentReducer.content);

  const [dataSource, setDataSource] = useState([]);
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setDataSource(usersToRate);
    } else {
      setDataSource([]);
    }
  }, [usersToRate, isVisible]);

  const {
    modal,
    container,
    rateUserText,
    rateUserContainer,
    buttonContainer,
    buttonStyle,
  } = styles;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      style={[modal]}
      onBackdropPress={closeAction}
      onSwipeComplete={closeAction}
      swipeDirection="up"
      useNativeDriver={true}>
      <View style={container}>
        <ViewRow style={rateUserContainer}>
          <Text style={rateUserText}>{content.usersToRate}</Text>
          <View style={{ justifyContent: 'center' }}>
            <CustomIcon
              type={'MaterialIcons'}
              name="rate-review"
              color="white"
              size={23}
              style={{ alignSelf: 'center', marginEnd: 5 }}
            />
          </View>
        </ViewRow>

        {!_.isEmpty(dataSource) ? (
          <FlatList
            data={dataSource}
            extraData={isRender}
            keyExtractor={(item, index) => index}
            enableEmptySections={true}
            renderItem={(item, index) => {
              return (
                <UserComponent
                  disableRightAction
                  user={item.item}
                  index={index}
                  iconName="rate-review"
                  onProfileClick={() =>
                    onProfileClick(item.item.email, item.item.toEdit)
                  }
                  fillWidth
                />
              );
            }}
          />
        ) : (
          <View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 110,
              }}>
              <Text>{content.wait}</Text>
            </View>
          </View>
        )}

        <View style={buttonContainer}>
          <RoundButton
            containerStyle={buttonStyle}
            text={'Okay'}
            onPress={closeAction}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rateUserContainer: {
    justifyContent: 'space-between',
    backgroundColor: colors.colorPrimary,
    marginBottom: 10,
  },
  rateUserText: {
    padding: 3,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    padding: 9,
  },
  buttonStyle: {
    zIndex: 1,
    paddingHorizontal: 40,
    borderRadius: 13,
    transform: [
      {
        translateY: 20,
      },
    ],
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0,
  },
  modal: {
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    flex: 1,
    position: 'absolute',
  },
  container: {
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    backgroundColor: 'white',
    borderRadius: 24,
    height: Dimensions.get('window').height / 1.5,
    marginHorizontal: 5,
    marginTop: Platform.OS === 'android' ? 60 : 100,
  },
  descriptionStyle: {
    paddingVertical: 32,
    textAlign: 'center',
  },
});
