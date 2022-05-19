import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  Pressable,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RoundButton} from '../../Buttons/RoundButton';
import {SelectLocationComponent} from '../../components/SelectLocationComponent';
import {BaseView} from '../../layout/BaseView';
import {Spacer} from '../../layout/Spacer';
import {routes} from '../../navigation/RouteNames';
import {colors} from '../../utils/Colors';
import {CustomInput} from '../../utils/CustomInput';
import {MainHeader} from '../../utils/MainHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Slider from 'rn-range-slider';
import Thumb from '../../components/rangePicker/Thumb';
import Rail from '../../components/rangePicker/Rail';
import RailSelected from '../../components/rangePicker/RailSelected';
import Label from '../../components/rangePicker/Label';
import Notch from '../../components/rangePicker/Notch';
import {CustomRadioButton} from '../../components/CustomRadioButton';
import {CommentInputComponent} from '../../components/CommentInputComponent';
import {constVar} from '../../utils/constStr';
import {useSelector, useDispatch} from 'react-redux';
import {CalendarPickerModal} from '../../utils/CalendarPickerModal';
import {
  ADD_END_POINT,
  ADD_START_DATE,
  ADD_START_POINT,
  CLEAR_ALL,
  HIDE_BOTTOM_TAB,
  REMOVE_MIDDLE_STOP,
  SET_RADIO_SELECTED,
  SET_SEARCH_OPEN,
} from '../../actions/types';

import {
  addPostToFavorites,
  addRemovePostToFavorites,
  createPost,
  getFavoritePosts,
  getPlaceInfo,
  resetValues,
} from '../../services/MainServices';
import {SearchLocationComponent} from '../../components/SearchLocationComponent';
import {useKeyboard} from '../../customHooks/useKeyboard';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {FiltersModal} from '../../utils/FiltersModal';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import moment from 'moment';
import {usePreventGoBack} from '../../customHooks/usePreventGoBack';
import {InfoPopupModal} from '../../utils/InfoPopupModal';
import {getValue, keyNames, setValue} from '../../utils/Storage';
import {HorizontalLine} from '../../components/HorizontalLine';
import {NotificationsModal} from '../../utils/NotificationsModal';
import Tooltip from '../../components/tooltip/Tooltip';
import {Loader} from '../../utils/Loader';
import {CustomIcon} from '../../components/CustomIcon';
import {CommonStyles} from '../../layout/CommonStyles';
import {LikeButton} from '../../components/LikeButton';
import {CustomText} from '../../components/CustomText';
import {ViewRow} from '../../components/HOCS/ViewRow';
import {
  clearAll,
  hideBottomTab,
  removeMiddleStop,
  setRadioSelected,
} from '../../actions/actions';
const CreatePostScreen = ({navigation, route}) => {
  const {width} = Dimensions.get('window');
  const {titleStyle} = CommonStyles;

  const initialModalInfoState = {
    preventActionText: 'Όχι',
    buttonText: 'Έξοδος',
    description: 'Είσαι σίγουρος θέλεις να κλείσεις την εφαρμογή;',
    postid: '',
  };
  const [openSearch, setOpenSearch] = useState({
    from: true,
    open: false,
    addStops: false,
  });
  const [cost, setCost] = useState(0);
  const [seats, setSeats] = useState(1);
  const [comment, setComment] = useState('');
  const [hasReturnDate, setHasReturnDate] = useState(false);
  const [rangeDate, setRangeDate] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [notificationsModalOpen, setNotificationModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const [allowPet, setAllowPet] = useState(false);
  const [modalInfo, setModalInfo] = useState(initialModalInfoState);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);

  const handleValueChange = useCallback((low, high) => {
    setCost(low);
  }, []);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const isKeyBoardOpen = useKeyboard();
  let tooltipRef = useRef();
  const post = useSelector(state => state.postReducer);
  const myUser = useSelector(state => state.authReducer.user);
  const generalReducer = useSelector(state => state.generalReducer);

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  useEffect(() => {
    if (openSearch.open) {
      dispatch(hideBottomTab(true));
    } else {
      dispatch(hideBottomTab(false));
    }
  }, [openSearch.open]);

  useEffect(() => {
    if (isFocused && route?.params?.params) {
      const {comment, cost, seats, petAllowed} = route.params.params;

      setComment(comment);
      setCost(cost);
      setSeats(seats);
      setAllowPet(petAllowed);
    }
  }, [isFocused]);

  const resetAll = () => {
    setComment('');
    setCost(0);
    setSeats(1);
    setAllowPet(null);
    dispatch(clearAll());
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, [openSearch.open]),
  );

  const handleBackButtonClick = async () => {
    if (openSearch.open) {
      setOpenSearch({from: true, open: false, addStops: false});
    } else {
      setModalCloseVisible(true);
    }
    return true;
  };

  const showDialogMsg = message => {
    setInfoMessage({
      info: message,
      success: false,
    });
    showCustomLayout();
  };

  const valid = () => {
    if (post.startplace === '' || post.endplace === '') {
      showDialogMsg('Πρέπει να επιλέξεις αρχικό και τελικό προορισμό!');
      return false;
    }

    if (rangeDate) {
      if (
        post?.startdate === constVar.initialDate ||
        post?.enddate === constVar.endDate
      ) {
        showDialogMsg('Πρέπει να επιλέξεις ημερομηνίες αναχώρησης!');
        return false;
      }
    } else {
      if (post?.startdate === constVar.initialDate) {
        showDialogMsg('Πρέπει να επιλέξεις ημερομηνία αναχώρησης!');
        return false;
      }
    }

    if (hasReturnDate) {
      if (
        post?.returnStartDate === constVar.returnStartDate &&
        post?.returnEndDate !== constVar.returnEndDate
      ) {
        showDialogMsg('Πρέπει να επιλέξεις αρχική ημερομηνία επιστροφής!');
        return false;
      }
    }

    return true;
  };

  const getHasReturnDate = () => {
    if (
      post.returnStartDate === constVar.returnStartDate &&
      post.returnEndDate === constVar.returnEndDate
    ) {
      return false;
    }

    if (post.returnStartDate !== constVar.returnStartDate) {
      return true;
    }
  };
  const onSubmit = () => {
    if (!valid()) return;

    let startDate = moment(post.startdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let send = {
      data: {
        email: myUser.email,
        date: moment(new Date()).format('YYYY-MM-DD'),
        startplace: post.startplace,
        startcoord: post.startcoord,
        endplace: post.endplace,
        endcoord: post.endcoord,
        numseats: seats,
        startdate: startDate,
        enddate:
          post.enddate === constVar.endDate
            ? startDate
            : moment(post.enddate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        returnStartDate:
          post.returnStartDate === constVar.returnStartDate
            ? null
            : moment(post.returnStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        returnEndDate:
          post.returnEndDate === constVar.returnEndDate
            ? moment(post.returnStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
            : moment(post.returnEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        withReturn: getHasReturnDate(),
        costperseat: cost,
        comment: comment,
        petAllowed: allowPet,
        moreplaces: post.moreplaces,
        isFavourite: 0,
      },
    };
    setIsLoading(true);
    createPost({
      data: send,
      successCallback: (message, postid) => {
        setIsLoading(false);
        setModalInfo({
          preventActionText: 'Όχι',
          buttonText: 'Προσθήκη',
          description: constVar.askForPostsFavorites,
          postid: postid,
        });
        setModalCloseVisible(true);
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  const getPlace = (place_id, place, isStartPoint) => {
    getPlaceInfo({
      place_id,
      successCallback: coordinates => {
        if (openSearch.from !== true && post.startcoord === coordinates) {
          showDialogMsg(
            'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως αρχικό προορισμό!',
          );
          return;
        }

        if (openSearch.from === true && post.endcoord === coordinates) {
          showDialogMsg(
            'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως τελικό προορισμό!',
          );
          return;
        }

        if (post.moreplaces.find(obj => obj.placecoords === coordinates)) {
          showDialogMsg(
            'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως ενδιάμεση στάση!',
          );
          return;
        }
        dispatch({
          type: getType(isStartPoint),
          payload: [place, coordinates],
        });
      },
      errorCallback: () => {},
    });
  };

  function getType(isStartPoint) {
    return isStartPoint ? ADD_START_POINT : ADD_END_POINT;
  }
  const addPostToFav = postid => {
    setIsLoading(true);
    addRemovePostToFavorites({
      postid: modalInfo.postid,
      successCallback: message => {
        setIsLoading(false);
        dispatch(
          getFavoritePosts(postsAmount => {
            setTimeout(() => {
              postsAmount === 1 && toggleTooltip();
            }, 800);
          }),
        );
        setModalCloseVisible(false);
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: message => {
        setIsLoading(false);
        setModalCloseVisible(false);
        setInfoMessage({info: message, success: false});
        showCustomLayout();
      },
    });
  };

  const setRadioSelection = option => {
    dispatch(setRadioSelected(option));
  };

  const commentRef = useRef(null);
  const toggleTooltip = () => {
    setTimeout(() => {
      tooltipRef.current.toggleTooltip();
    }, 500);
  };

  const onScroll = () => {
    return delay => {
      setTimeout(() => {
        scrollRef.current.scrollToEnd({animated: true});
      }, delay);
    };
  };

  const goToSettings = () => {
    navigation.navigate(routes.SETTINGS_SCREEN, {email: myUser.email});
  };

  const goToFavorites = () => {
    navigation.navigate(routes.FAVORITE_POSTS_SCREEN);
  };

  function renderSeats() {
    return (
      <View>
        <View style={[titleStyle, {marginBottom: 15, marginTop: 25}]}>
          <CustomText type={'title1'} text={'Αριθμός θέσεων'} />
        </View>

        <View style={seatsContainer}>
          <TouchableOpacity
            style={leftAddSeat}
            onPress={() => seats > 1 && setSeats(seats - 1)}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>

          <Text style={{marginHorizontal: 10, fontSize: 20, color: 'black'}}>
            {seats}
          </Text>

          <TouchableOpacity
            style={rightAddSeat}
            onPress={() => seats < 7 && setSeats(seats + 1)}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderCost() {
    return (
      <View>
        <View style={[titleStyle, {marginBottom: 15, marginTop: 25}]}>
          <CustomText type={'title1'} text={'Ελάχιστο κόστος'} />
        </View>

        <View style={amountLabel}>
          <Text style={{fontSize: 25, color: 'black'}}>{cost}</Text>
          <Text style={{fontSize: 20, color: 'black'}}>€</Text>
        </View>

        <Spacer height={10} />
        <Slider
          style={styles.slider}
          min={0}
          max={100}
          step={1}
          floatingLabel
          disableRange={true}
          low={cost}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onValueChanged={handleValueChange}
          style={{marginHorizontal: 8}}
        />
      </View>
    );
  }

  function renderStops() {
    return (
      <View>
        <View style={titleStyle}>
          <CustomText
            type={'title1'}
            text={'Στάσεις που μπορώ να κάνω'}
            color="black"
          />
        </View>

        <Spacer height={15} />

        {post?.moreplaces?.map((item, index) => (
          <LocationItem index={index} item={item} />
        ))}

        <Spacer height={15} />
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <RoundButton
            containerStyle={addStopStyle}
            leftIcon={true}
            text={'Προσθήκη'}
            onPress={() => {
              setOpenSearch({from: true, open: true, addStops: true});
            }}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </View>
    );
  }

  function LocationItem({index, item}) {
    return (
      <View key={index} style={locationContainer}>
        <ViewRow>
          <Entypo
            name="location-pin"
            size={24}
            style={{opacity: 0.4}}
            color={'black'}
          />
          <Text style={locationTextStyle}>{item.place.split(',')[0]}</Text>
        </ViewRow>

        <MaterialCommunityIcons
          onPress={() => {
            dispatch(removeMiddleStop(item.placecoords));
          }}
          name="delete"
          size={24}
          color={'red'}
          style={{alignSelf: 'center', marginEnd: 8}}
        />
      </View>
    );
  }

  const {
    leftAddSeat,
    rightAddSeat,
    amountLabel,
    addStopStyle,
    seatsContainer,
    locationContainer,
    locationTextStyle,
    allowPetStyle,
    forbidTextStyle,
    linksStyle,
  } = styles;
  return (
    <BaseView
      showStatusBar={true}
      statusBarColor={colors.colorPrimary}
      removePadding>
      <Loader isLoading={isLoading} />
      <Tooltip
        skipAndroidStatusBar={true}
        disabled={true}
        ref={tooltipRef}
        width={width / 1.2}
        height={null}
        backgroundColor={colors.colorPrimary}
        withOverlay={true}
        pointerColor={colors.colorPrimary}
        toggleOnPress={false}
        triangleOffset={width / 1.19}
        trianglePosition="left"
        popover={
          <Text style={{color: 'white'}}>
            Εδώ μπορείς να δείς τα αγαπημένα σου post.
          </Text>
        }>
        <MainHeader
          showFavTooltip={true}
          showStatusBar={true}
          isCreatePost={true}
          onSettingsPress={goToSettings}
          showX={openSearch.open === true}
          title={
            openSearch.open === true
              ? constVar.searchBottomTab
              : constVar.createPostBottomTab
          }
          onClose={() => {
            setOpenSearch({from: true, open: false, addStops: false});
          }}
          onNotificationPress={() => {
            setNotificationModalOpen(true);
          }}
          onFilterPress={() => {
            setIsModalVisible(true);
          }}
          onFavoritePostsPress={goToFavorites}
        />
      </Tooltip>

      {myUser.car !== null ? (
        <KeyboardAwareScrollView
          scrollEnabled={!generalReducer.isToolTipVisible}
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          ref={scrollRef}>
          <Spacer height={15} />
          <SelectLocationComponent
            containerStyle={{marginHorizontal: 16}}
            titleStart={constVar.startDestination}
            titleEnd={constVar.endDestination}
            isPostScreen={true}
            onReset={resetAll}
            startingPointPress={() => {
              setOpenSearch({from: true, open: true, addStops: false});
            }}
            endPointPress={() => {
              setOpenSearch({from: false, open: true, addStops: false});
            }}
          />
          <Spacer height={20} />

          {renderStops()}

          {/* <HorizontalLine containerStyle={halfLine} /> */}
          {renderSeats()}

          {/* <HorizontalLine containerStyle={[halfLine, {marginVertical: 10}]} /> */}
          {renderCost()}

          <Spacer height={15} />

          {/* <HorizontalLine containerStyle={[halfLine, {marginVertical: 10}]} /> */}
          <Spacer height={10} />
          <View style={titleStyle}>
            <CustomText type={'title1'} text={'Κατοικίδια'} />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setAllowPet(!allowPet);
            }}
            style={allowPetStyle}>
            <Text style={linksStyle}>δεκτά κατοικίδια</Text>

            <LikeButton isLiked={allowPet} />
          </TouchableOpacity>

          <Spacer height={20} />

          <CustomRadioButton
            returnedDate={hasReturnDate => {
              setHasReturnDate(hasReturnDate);
            }}
            rangeRadioSelected={choice => {
              setRangeDate(choice === 'many' ? true : false);
            }}
            selectedOption={option => {
              setRadioSelection(option);
              setIsPickerVisible(true);
            }}
            onIconPress={onScroll(200)}
          />

          <CommentInputComponent
            onFocus={() => scrollRef.current.scrollToEnd({animated: true})}
            value={comment}
            removeNote={true}
            extraStyle={{marginTop: 10, marginBottom: 16}}
            onChangeText={val => setComment(val)}
          />

          <RoundButton
            containerStyle={{
              marginHorizontal: 16,
              marginBottom: isKeyBoardOpen ? 10 : 70,
            }}
            text={constVar.submit}
            backgroundColor={colors.colorPrimary}
            onPress={onSubmit}
          />
        </KeyboardAwareScrollView>
      ) : (
        <View style={forbidTextStyle}>
          <Text style={{textAlign: 'center'}}>{constVar.forbidCreatePost}</Text>
        </View>
      )}

      {openSearch.open && (
        <SearchLocationComponent
          from={openSearch.from}
          addStops={openSearch.addStops}
          showMessage={message => {
            setInfoMessage({info: message, success: false});
            showCustomLayout();
          }}
          onPress={(place_id, place, isStartPoint) => {
            getPlace(place_id, place, isStartPoint);
            setOpenSearch({from: true, open: false, addStops: false});
          }}
        />
      )}

      <CalendarPickerModal
        isVisible={isPickerVisible}
        closeAction={() => {
          setIsPickerVisible(false);
        }}
        buttonPress={index => {
          if (index === 1) {
            setIsPickerVisible(false);
            return;
          }
          setIsPickerVisible(false);
        }}
      />

      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
      <InfoPopupModal
        preventAction={true}
        preventActionText={modalInfo.preventActionText}
        buttonText={modalInfo.buttonText}
        isVisible={modalCloseVisible}
        description={modalInfo.description}
        closeAction={() => {
          setModalCloseVisible(false);
          setModalInfo(initialModalInfoState);
        }}
        buttonPress={() => {
          modalInfo.description !== constVar.askForPostsFavorites
            ? BackHandler.exitApp()
            : addPostToFav(modalInfo.postid);
        }}
        descrStyle={true}
      />
      <NotificationsModal
        onSubmit={(rating, text) => {}}
        isVisible={notificationsModalOpen}
        onProfileClick={(email, toEdit) => {
          setNotificationModalOpen(false);
          navigation.navigate(routes.PROFILE_STACK, {
            screen: routes.PROFILE_SCREEN,
            params: {email: email},
          });
        }}
        closeAction={() => {
          setNotificationModalOpen(false);
        }}
      />
    </BaseView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  amountLabel: {
    height: 45,
    width: 'auto',
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.CoolGray1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  addStopStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.colorPrimary,
    borderWidth: 1,
  },
  leftAddSeat: {
    height: 45,
    width: 40,
    backgroundColor: colors.CoolGray2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightAddSeat: {
    height: 45,
    width: 40,
    backgroundColor: colors.CoolGray2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  seatsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  locationContainer: {
    marginStart: 16,
    marginVertical: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  locationTextStyle: {
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
    marginStart: 10,
  },
  allowPetStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  forbidTextStyle: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  linksStyle: {
    color: colors.subtitleColor,
    marginEnd: 5,
    textDecorationLine: 'underline',
  },
});
