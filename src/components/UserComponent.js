import _ from 'lodash';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BASE_URL} from '../constants/Constants';
import {Spacer} from '../layout/Spacer';

import {colors} from '../utils/Colors';
import {StarsRating} from '../utils/StarsRating';
import {CustomIcon} from './CustomIcon';
import {ViewRow} from './HOCS/ViewRow';
import {PictureComponent} from './PictureComponent';

export function UserComponent({
  user,
  onProfileClick,
  deleteInterested,
  giveApproval,
  fillWidth,
  iconName,
  disableRightAction,
}) {
  const {userStyleAdded, stretch, noStretch, container} = styles;

  let color = _.isNull(user.isVerified)
    ? null
    : user.isVerified === true
    ? colors.verifiedUser
    : colors.CoolGray2;

  return (
    <TouchableOpacity
      onPress={() => {
        onProfileClick(user.email);
      }}>
      <View
        style={[
          userStyleAdded,
          fillWidth ? stretch : noStretch,
          {backgroundColor: color},
        ]}>
        <View style={container}>
          <PictureComponent imageSize="small" url={BASE_URL + user.imagePath} />
          <Spacer width={14} />
          <View style={{alignSelf: 'center'}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
              {user.fullname}
            </Text>
            {user?.average > 0 && (
              <ViewRow style={{alignItems: 'center'}}>
                <StarsRating rating={user.average} size="small" />
                <Text style={{fontSize: 10, color: '#595959', opacity: 0.6}}>
                  {' '}
                  ({user.count})
                </Text>
              </ViewRow>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <TouchableOpacity onPress={() => {
                        deleteInterested(user.piid)
                    }}>

                        <FontAwesome name="close" size={24} color='red' style={{ marginHorizontal: 10 }} /> 
                    </TouchableOpacity> */}
          <TouchableOpacity
            disabled={disableRightAction}
            onPress={() => {
              giveApproval(user.piid, user.isVerified);
            }}>
            {_.isNull(user.isVerified) ? (
              <ActivityIndicator
                size="small"
                style={{marginHorizontal: 5}}
                animating={true}
                hidesWhenStopped={true}
                color={colors.colorPrimary}
              />
            ) : (
              <CustomIcon
                type={!iconName ? 'Entypo' : 'MaterialIcons'}
                name={
                  iconName ? iconName : user.isVerified ? 'check' : 'add-user'
                }
                size={22}
                color={colors.infoColor}
                style={{marginHorizontal: 5}}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Spacer height={10} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userStyleAdded: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 6,

    borderRadius: 13,
    marginEnd: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stretch: {
    justifyContent: 'space-between',
    width: '100%',
  },
  noStretch: {
    alignSelf: 'baseline',
  },
});
