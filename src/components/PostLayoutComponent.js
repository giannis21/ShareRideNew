import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {BASE_URL} from '../constants/Constants';
import {Spacer} from '../layout/Spacer';
import {colors} from '../utils/Colors';
import {PictureComponent} from './PictureComponent';
import {useSelector, useDispatch} from 'react-redux';
import {StarsRating} from '../utils/StarsRating';
import {DestinationsComponent} from './DestinationsComponent';
import {ViewRow} from './HOCS/ViewRow';
import {DatesPostComponent} from './DatesPostComponent';
import {HorizontalLine} from './HorizontalLine';
import {Paragraph} from './HOCS/Paragraph';

export function PostLayoutComponent({
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
  openHocScreen,
}) {
  var _ = require('lodash');
  const [isSafeClick, setSafeClick] = useState(true);

  const myUser = useSelector(state => state.authReducer.user);

  const safeClickListener = callback => {
    setSafeClick(false);
    setTimeout(function () {
      setSafeClick(true);
    }, 1000);
  };

  const goToProfile = () => {
    if (isSafeClick) {
      if (!showMenu) {
        onProfileClick(item?.user?.email ?? myUser.email);
        safeClickListener();
      }
    }
  };

  function BottomContainer({onIconPress, title}) {
    return (
      <View>
        <View style={{marginTop: 14}}>
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
                <Text style={seats}>({item.users}) </Text>
              </Paragraph>
              <TouchableOpacity
                onPress={() => {
                  onIconPress(item);
                }}
                style={circleBottomIcon}>
                <AntDesign name="arrowright" size={15} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              onPress={() => {
                onIconPress(item);
              }}
              style={[
                {
                  textAlign: 'center',
                  padding: 5,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  backgroundColor: colors.infoColor,
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                },
              ]}>
              Ξαναπόσταρε{' '}
            </Text>
          )}
        </View>
        <HorizontalLine containerStyle={{height: 4}} />
      </View>
    );
  }
  function HeartLike({disableStyle}) {
    return (
      <TouchableOpacity
        disabled={disableStyle}
        style={[disableStyle ? null : heartContainer, {marginEnd: 10}]}
        onPress={() => {
          if (isSafeClick) {
            onLikeClick(item?.post?.postid, index);
            safeClickListener();
          }
        }}>
        <Entypo
          name={!item.interested && !disableStyle ? 'heart-outlined' : 'heart'}
          size={20}
          color={colors.like_red}
        />
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
    <TouchableOpacity
      opacity={0.9}
      onPress={() => {
        onPress(item);
      }}
      style={container}>
      {item?.post ? (
        <View>
          <Spacer height={5} />
          <ViewRow>
            <View style={leftContainer}>
              <PictureComponent
                onPress={
                  onProfileClick
                    ? () => onProfileClick && goToProfile()
                    : undefined
                }
                imageSize="small"
                url={BASE_URL + item.imagePath}
              />
            </View>

            <View style={rightContainer}>
              <View style={rightContainerView}>
                <View style={{width: '48%'}}>
                  <Text
                    onPress={() => onProfileClick && goToProfile()}
                    style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
                    {item?.user?.fullname ?? myUser.fullName}
                  </Text>

                  {((item?.user?.count && item?.user?.count > 0) ||
                    (myUser.count > 0 && _.isUndefined(item?.user?.email))) && (
                    <ViewRow style={{alignItems: 'center'}}>
                      <StarsRating
                        rating={item?.user?.average ?? myUser.average}
                        size="small"
                      />
                      <Text
                        style={{fontSize: 10, color: '#595959', opacity: 0.6}}>
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

                  <DestinationsComponent
                    containerStyle={{marginTop: 10, marginBottom: 15}}
                    moreplaces={item?.post?.moreplaces}
                    startplace={item?.post?.startplace}
                    endplace={item?.post?.endplace}
                  />
                </View>
                <View style={{width: '49%'}}>
                  {showMenu && (
                    <Entypo
                      onPress={() => {
                        onMenuClicked(item);
                      }}
                      name="dots-three-horizontal"
                      size={20}
                      color="black"
                      style={{alignSelf: 'flex-end', marginEnd: 10}}
                    />
                  )}
                  <DatesPostComponent
                    style={{marginTop: showMenu ? 25 : 44}}
                    item={item}
                  />
                </View>
              </View>

              <View style={bottomContainer}>
                <ViewRow style={{alignItems: 'center'}}>
                  {showFavoriteIcon && <HeartLike />}

                  {/* {<TouchableOpacity onPress={openHocScreen} >
                                        <ViewRow style={{ marginEnd: 10, backgroundColor: colors.CoolGray2, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 15, marginEnd: 4 }}>50</Text>
                                            <HeartLike disableStyle />
                                        </ViewRow>
                                    </TouchableOpacity>

                                    } */}

                  <Paragraph>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#595959',
                        opacity: 0.6,
                        marginStart: 10,
                      }}>
                      Θέσεις:
                    </Text>
                    <Text style={seats}> {item?.post?.numseats} </Text>
                  </Paragraph>
                </ViewRow>
                <Paragraph color={'black'} containerStyle={{fontSize: 13}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {item.post.costperseat}€{' '}
                  </Text>
                  <Text>/Θέση</Text>
                </Paragraph>
              </View>
            </View>
          </ViewRow>
          {isFavoritePostsScreen && (
            <BottomContainer
              title={'ΞαναΠόσταρε'}
              onIconPress={val => {
                goToPreviewFavorite(val);
              }}
            />
          )}

          {showInterested && item.hasMoreUsers && (
            <BottomContainer
              title={'Δείτε τους ενδιαφερόμενους'}
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
}

const styles = StyleSheet.create({
  circleBottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: colors.infoColor,
    borderRadius: 50,
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
