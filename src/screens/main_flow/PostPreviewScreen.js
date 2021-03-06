import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  BackHandler,
  DeviceEventEmitter,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RoundButton } from '../../Buttons/RoundButton';
import { SelectLocationComponent } from '../../components/SelectLocationComponent';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';
import { routes } from '../../navigation/RouteNames';
import { colors } from '../../utils/Colors';
import { CustomInput } from '../../utils/CustomInput';
import { MainHeader } from '../../utils/MainHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from 'rn-range-slider';
import Thumb from '../../components/rangePicker/Thumb';
import Rail from '../../components/rangePicker/Rail';
import RailSelected from '../../components/rangePicker/RailSelected';
import Label from '../../components/rangePicker/Label';
import Notch from '../../components/rangePicker/Notch';
import { CustomRadioButton } from '../../components/CustomRadioButton';
import { CommentInputComponent } from '../../components/CommentInputComponent';
import { constVar } from '../../utils/constStr';
import { useSelector, useDispatch } from 'react-redux';
import { CalendarPickerModal } from '../../utils/CalendarPickerModal';
import {
  ADD_ACTIVE_POST,
  ADD_END_POINT,
  ADD_START_DATE,
  ADD_START_POINT,
  CLEAR_ALL,
  REMOVE_MIDDLE_STOP,
  SET_RADIO_SELECTED,
  SET_SEARCHID_MODIFIED,
  SET_SEARCH_POSTID_MODIFIED,
} from '../../actions/types';

import {
  createPost,
  getPlaceInfo,
  getPostPerId,
  resetValues,
  showInterest,
} from '../../services/MainServices';
import { SearchLocationComponent } from '../../components/SearchLocationComponent';
import { useKeyboard } from '../../customHooks/useKeyboard';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { FiltersModal } from '../../utils/FiltersModal';
import moment from 'moment';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { StarsRating } from '../../utils/StarsRating';
import { MiddleStopsComponent } from '../../components/MiddleStopsComponent';
import { DestinationsComponent } from '../../components/DestinationsComponent';
import { BASE_URL } from '../../constants/Constants';
import { PictureComponent } from '../../components/PictureComponent';
import { ViewRow } from '../../components/HOCS/ViewRow';
import { DatesPostComponent } from '../../components/DatesPostComponent';
import { Loader } from '../../utils/Loader';
import { usePreventGoBack } from '../../customHooks/usePreventGoBack';
import { HorizontalLine } from '../../components/HorizontalLine';
import { Paragraph } from '../../components/HOCS/Paragraph';
import { LikeButton } from '../../components/LikeButton';
import { CommonStyles } from '../../layout/CommonStyles';
import { CustomText } from '../../components/CustomText';
import { setActiveNotification, setActivePost } from '../../actions/actions';
import { DestinationsComponentHorizontal } from '../../components/DestinationsComponentHorizontal';
import { showToast } from '../../utils/Functions';

let myTimeout;
const PostPreviewScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [data, setData] = useState({
    startPoint: '',
    endPoint: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const [isLoading, setLoading] = useState(false);
  const [allowPet, setAllowPet] = useState(false);
  const [isSafeClick, setSafeClick] = useState(true);
  const {
    showFavoriteIcon,
    isPostInterested,
    isSearchedPost,
    showCloseIcon,
    isDeepLink,
    resetActivePost
  } = route.params;

  const { titleStyle } = CommonStyles;
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const isFocused = useIsFocused()
  const content = useSelector(state => state.contentReducer.content);
  const myUser = useSelector(state => state.authReducer.user);
  const item = useSelector(state => state.postReducer.activePost);
  const [liked, setLiked] = useState(item?.interested ?? false);

  useEffect(() => {
    if (isDeepLink) {
      dispatch(getPostPerId());
    }
  }, []);

  useEffect(() => {
    item?.interested && setLiked(item.interested)
  }, [item?.interested]);

  // useEffect(() => {
  //   if (!isFocused && !resetActivePost) {
  //     dispatch(setActivePost({}))
  //   }
  // }, [isFocused])
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', goBack);
      return () => BackHandler.removeEventListener('hardwareBackPress', goBack);
    }, [liked, item]),
  );

  const navigation1 = useNavigation();
  const safeClickListener = callback => {
    setSafeClick(false);
    setTimeout(function () {
      setSafeClick(true);
    }, 1000);
  };

  const goToProfile = () => {
    if (isSafeClick && item?.user?.email !== myUser.email) {
      try {
        navigation.navigate(routes.PROFILE_STACK, {
          screen: routes.PROFILE_SCREEN,
          params: { email: item?.user?.email },
        });
      } catch (err) {
        navigation1.push(routes.PROFILE_SCREEN, { email: item?.user?.email });
      }

      safeClickListener();
    }
  };

  const onLikeClick = () => {
    setLoading(true);

    showInterest({
      email: myUser.email,
      postId: item.post.postid,
      successCallback: message => {
        setLoading(false);
        setLiked(!liked);
        showToast(message)
      },
      errorCallback: message => {
        setLoading(false);
        showToast(message, false)
      },
    });
  };

  const goBack = () => {

    if (isPostInterested && item.interested !== liked) {
      navigation.navigate(routes.POSTS_INTERESTED_PROFILE_SCREEN, {
        postId: item.post.postid,
        liked,
      });
    }
    else if (isSearchedPost && item.interested !== liked) {
      dispatch({ type: SET_SEARCH_POSTID_MODIFIED, payload: item.post.postid });
      navigation.goBack();
    } else {
      isDeepLink && dispatch(setActiveNotification(false));
      navigation.pop();
    }

    return true;
  };

  const { bottomContainer, leftContainer, heartContainer, seatsStyle } = styles;

  return (
    <BaseView
      iosBackgroundColor={'transparent'}
      showStatusBar={true}
      statusBarColor={'black'}
      removePadding={true}
      containerStyle={{
        flex: 1,
      }}>
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Loader isLoading={isLoading} />
        <TopContainerExtraFields
          showArrow={!showCloseIcon}
          onCloseContainer={goBack}
          title={content.previewRide}
          addMarginStart
        />
        <Spacer height={5} />
        {item?.post ? (
          <KeyboardAwareScrollView
            extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            ref={scrollRef}
            style={{}}>
            <ViewRow>
              <View style={leftContainer}>
                <PictureComponent
                  containerStyle={{ marginStart: 10 }}
                  onPress={
                    item?.post?.email !== myUser.email
                      ? () => {
                        goToProfile();
                      }
                      : undefined
                  }
                  imageSize="small"
                  url={BASE_URL + item.imagePath}
                />
                <Spacer width={15} />
              </View>
              <View style={{ width: '80%', marginStart: 10, end: 16 }}>
                <Text
                  onPress={goToProfile}
                  disabled={item?.post?.email === myUser.email}
                  style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>
                  {item?.user?.fullname ?? myUser.fullName}
                </Text>

                {((item?.user?.count && item?.user?.count > 0) ||
                  (myUser.count > 0 && _.isUndefined(item?.user?.email))) && (
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <StarsRating
                        rating={item?.user?.average ?? myUser.average}
                        size="small"
                      />
                      <Text
                        style={{ fontSize: 10, color: '#595959', opacity: 0.6 }}>
                        {' '}
                        ({item?.user?.count ?? myUser.count})
                      </Text>
                    </View>
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


                <Spacer height={25} />
                <DestinationsComponentHorizontal
                  containerStyle={{ marginTop: 10, marginBottom: 15 }}
                  moreplaces={item?.post?.moreplaces}
                  startplace={item?.post?.startplace}
                  endplace={item?.post?.endplace}
                />


              </View>
              {/* locations view   */}

            </ViewRow>

            <HorizontalLine />

            <View style={bottomContainer}>
              <ViewRow style={{ alignItems: 'center' }}>
                {showFavoriteIcon && (
                  <TouchableOpacity
                    style={heartContainer}
                    onPress={() => {
                      if (isSafeClick) {
                        onLikeClick();
                        safeClickListener();
                      }
                    }}>
                    <LikeButton isLiked={liked} />
                  </TouchableOpacity>
                )}
                <Paragraph marginStart={10}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#595959',
                      opacity: 0.6,
                      marginStart: 10,
                    }}>
                    {content.seats}
                  </Text>
                  <Text style={seatsStyle}> {item.post.numseats} </Text>
                </Paragraph>
              </ViewRow>
              <Paragraph color={'black'} containerStyle={{ fontSize: 13 }}>
                <Text style={{ fontWeight: 'bold' }}>
                  {item.post.costperseat}???{' '}
                </Text>
                <Text>{content.perSeat}</Text>
              </Paragraph>
            </View>
            <DatesPostComponent item={item} size={'big'} />
            <View style={[titleStyle, { marginBottom: 10, marginTop: 25 }]}>
              <CustomText type={'title1'} text={content.petAllowed} />
            </View>

            <Text
              style={{
                fontSize: 18,
                marginLeft: 17,

                color: 'black',
              }}>
              {item.post.petAllowed ? '??????' : content.noC}
            </Text>

            {item?.post?.comment !== '' && (
              <View>
                <View style={[titleStyle, { marginBottom: 15, marginTop: 15 }]}>
                  <CustomText type={'title1'} text={content.comments} />
                </View>

                <Text
                  style={{
                    fontSize: 18,
                    marginLeft: 15,
                    color: 'black',
                  }}>
                  {item?.post?.comment}
                </Text>
              </View>
            )}
          </KeyboardAwareScrollView>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: Dimensions.get('window').height / 2.5,
            }}>
            <Text>{content.wait}</Text>
          </View>
        )}

      </View>
    </BaseView>
  );
};

export default PostPreviewScreen;

const styles = StyleSheet.create({
  textStyle1: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingStart: 16,
    marginTop: 15,
    backgroundColor: colors.CoolGray2,
    paddingVertical: 1,
    color: 'black',
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
  seatsStyle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginStart: 10,
    color: 'black',
  },
  heartContainer: {
    borderRadius: 5,
    height: 33,
    width: 33,
    backgroundColor: colors.CoolGray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContainer: {
    width: '16%',
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
  bottomContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 5,
    marginHorizontal: 10,
  },
});
