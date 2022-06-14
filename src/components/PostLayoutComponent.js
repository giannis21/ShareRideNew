import React, { memo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BASE_URL } from '../constants/Constants';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { PictureComponent } from './PictureComponent';
import { useSelector, useDispatch } from 'react-redux';
import { StarsRating } from '../utils/StarsRating';
import { DestinationsComponentHorizontal } from './DestinationsComponentHorizontal';
import { ViewRow } from './HOCS/ViewRow';
import { DatesPostComponentHorizontal } from './DatesPostComponentHorizontal';
import { HorizontalLine } from './HorizontalLine';
import { Paragraph } from './HOCS/Paragraph';
import { LikeButton } from './LikeButton';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import { CommonStyles } from '../layout/CommonStyles';

export const PostLayoutComponent = memo(
  ({
    onPress,
    onProfileClick,
    onLikeClick,
    index,
    item,
    onMenuClicked,
    showMenu,
    showInterested,
    isFavoritePostsScreen,
    showMoreUsers,
    showFavoriteIcon,
    goToPreviewFavorite,
  }) => {
    var _ = require('lodash');
    const [isSafeClick, setSafeClick] = useState(true);
    const liked = useSharedValue(0);
    const content = useSelector(state => state.contentReducer.content);
    const { justifyBetween, justifyEvenly, justifyAround } = CommonStyles
    const outlineStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
          },
        ],
      };
    });

    const fillStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: liked.value,
          },
        ],
        opacity: liked.value,
      };
    });

    useEffect(() => {
      liked.value = withSpring(item.interested ? 1 : 0);
    }, [item.interested]);

    const myUser = useSelector(state => state.authReducer.user);

    const safeClickListener = callback => {
      setSafeClick(false);
      setTimeout(function () {
        setSafeClick(true);
      }, 1000);
    };

    const goToProfile = () => {
      if (isSafeClick && !showMenu) {
        onProfileClick(item?.user?.email ?? myUser.email);
        safeClickListener();
      }
    };

    function BottomContainer({ onIconPress, title }) {
      return (

        <View style={{ marginTop: 14 }}>
          {!isFavoritePostsScreen ? (
            <View style={addMoreUsers}>
              <Paragraph>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#595959',
                    opacity: 0.6,
                    marginStart: 10,
                  }}>
                  {title}
                </Text>
                <Text style={seats}>({item.countUsers}) </Text>
              </Paragraph>
              <TouchableOpacity
                onPress={() => {
                  onIconPress(item);
                }}
                style={circleBottomIcon}>
                <AntDesign name="arrowright" size={15} color={colors.colorPrimary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{

                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                borderColor: 'black',
                backgroundColor: colors.colorPrimary,
                //  borderTopWidth: 0.4,
                overflow: 'hidden',
              }}>
              <Text
                onPress={() => {
                  onIconPress(item);
                }}
                style={[
                  {
                    textAlign: 'center',
                    padding: 5,

                    fontSize: 14,
                    color: 'white',
                    fontWeight: 'bold',
                  },
                ]}>
                {title}
              </Text>
            </View>
          )}

          <HorizontalLine containerStyle={{ height: 4, width: '100%' }} />
        </View>


      );
    }
    function HeartLike({ disableStyle }) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (isSafeClick) {
              onLikeClick(item?.post?.postid, index);
              safeClickListener();
            }
          }}
          style={[disableStyle ? null : heartContainer, { marginEnd: 10 }]}>
          {/* <LikeButton
          key={item?.post?.postid}
          postId={item?.post?.postid}
          isLiked={item.interested || disableStyle}
          onPress={() => {
            if (isSafeClick) {
              onLikeClick(item?.post?.postid, index);
              safeClickListener();
            }
          }}
        /> */}

          <View disabled={!onPress}>
            <Animated.View
              style={[StyleSheet.absoluteFillObject, outlineStyle]}>
              <MaterialCommunityIcons
                name={'heart-outline'}
                size={20}
                color={colors.like_red}
              />
            </Animated.View>

            <Animated.View style={fillStyle}>
              <MaterialCommunityIcons
                name={'heart'}
                size={20}
                color={colors.like_red}
              />
            </Animated.View>
          </View>

        </TouchableOpacity>
      );
    }

    const {
      addMoreUsers,
      circleBottomIcon,
      userStyle,
      leftContainer,
      rightContainer,
      container,
      rightContainerView,
      locationsLine,
      heartContainer,
      bottomContainer,
      seats,
    } = styles;

    return (
      <TouchableOpacity key={item?.post?.postid}
        onPress={() => {
          onPress && onPress(item);
        }}
        style={container}>
        {item?.post ? (
          <View>
            <Spacer height={5} />
            <ViewRow style={justifyBetween}>
              <ViewRow>
                <PictureComponent
                  onPress={onProfileClick ? () => goToProfile() : undefined}
                  imageSize="small"
                  url={BASE_URL + item.imagePath}
                />
                <Spacer width={10} />
                <View style={{ width: '86%' }}>
                  <Text
                    onPress={() => onProfileClick && goToProfile()}
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {item?.user?.fullname ?? myUser.fullName}
                  </Text>

                  {((item?.user?.count && item?.user?.count > 0) ||
                    (myUser.count > 0 &&
                      _.isUndefined(item?.user?.email))) && (
                      <ViewRow style={{ alignItems: 'center' }}>
                        <StarsRating
                          rating={item?.user?.average ?? myUser.average}
                          size="small"
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#595959',
                            opacity: 0.6,
                          }}>
                          {' '}
                          ({item?.user?.count ?? myUser.count})
                        </Text>
                      </ViewRow>
                    )}

                  <Text
                    style={{
                      fontSize: 12,
                      color: '#595959',
                      opacity: 0.6,
                      marginEnd: 10,
                      marginTop: 4,
                    }}>
                    {item?.post?.date} - {item?.post?.postid}
                  </Text>

                  <DatesPostComponentHorizontal
                    style={{ marginTop: 15 }}
                    item={item}
                  />
                  <Spacer height={10} />

                  <DestinationsComponentHorizontal
                    containerStyle={{ marginTop: 10, marginBottom: 15, width: '100%' }}
                    moreplaces={item?.post?.moreplaces}
                    startplace={item?.post?.startplace}
                    endplace={item?.post?.endplace}
                  />


                  <HorizontalLine />
                  <View style={bottomContainer}>


                    <ViewRow style={{ alignItems: 'center' }}>
                      {showFavoriteIcon && <HeartLike />}

                      <Paragraph>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#595959',
                            opacity: 0.6,
                            marginStart: 10,
                          }}>
                          {content.seats}
                        </Text>
                        <Text style={seats}> {item?.post?.numseats} </Text>
                      </Paragraph>
                    </ViewRow>
                    <Paragraph color={'black'} containerStyle={{ fontSize: 13 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.post.costperseat}€{' '}
                      </Text>
                      <Text>{content.perSeat}</Text>

                    </Paragraph>
                  </View>

                </View>

              </ViewRow>

              {showMenu && (
                <Entypo
                  onPress={() => {
                    onMenuClicked(item);
                  }}
                  name="dots-three-horizontal"
                  size={20}
                  color="black"
                  style={{ end: 30 }}
                />
              )}

            </ViewRow>
            {/* <Spacer height={10} />
            <HorizontalLine /> */}

            {isFavoritePostsScreen && (
              <BottomContainer
                title={content.repost}
                onIconPress={val => {

                  goToPreviewFavorite(val);
                }}
              />
            )}

            {item?.countUsers > 0 && showInterested && (
              <BottomContainer
                title={content.showInterested}
                onIconPress={val => {
                  showMoreUsers(val);
                }}
              />
            )}
          </View>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  circleBottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: colors.colorPrimary,
    borderWidth: 1
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: colors.colorPrimary,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  userStyle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.CoolGray2,
    alignSelf: 'baseline',
    width: 'auto',
    borderRadius: 13,
    marginEnd: 10,
  },
  addMoreUsers: {
    paddingHorizontal: 13,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'baseline',

    borderRadius: 13,
    marginEnd: 10,
    marginBottom: 10,
  },
  userStyleAdded: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c5dde3',
    alignSelf: 'baseline',
    width: 'auto',
    borderRadius: 13,
    marginEnd: 10,
  },
  seats: {
    fontSize: 13,
    fontWeight: 'bold',
    marginStart: 10,
    color: 'black',
  },
  leftContainer: {
    width: '12%',
  },
  rightContainer: {
    width: '84%',
  },
  rightContainerView: {
    borderBottomWidth: 1,
    paddingBottom: 7,
    borderBottomColor: colors.CoolGray1,
    flexDirection: 'row',
  },

  date: {
    color: 'white',
    borderRadius: 22,
    paddingVertical: 2,
    fontSize: 10,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: colors.colorPrimary,
  },
  container: {
    height: 'auto',
    backgroundColor: 'white',
    marginRight: 6,
    borderRadius: 6,
    marginHorizontal: 5,
    paddingVertical: 10,
  },

  bottomContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 5,
  },
  locationsLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 9,
    right: 0,
    backgroundColor: colors.CoolGray1.toString(),
    width: 1,
    marginVertical: 15,
  },
  heartContainer: {
    borderRadius: 5,
    height: 33,
    width: 33,
    backgroundColor: colors.CoolGray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
