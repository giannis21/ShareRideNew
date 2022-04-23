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
const CreatePostScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const initialModalInfoState = {
    preventActionText: 'Όχι',
    buttonText: 'Έξοδος',
    description: 'Είσαι σίγουρος θέλεις να κλείσεις την εφαρμογή;',
    postid: '',
  };
  const [data, setData] = useState({
    startPoint: '',
    endPoint: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const [cost, setCost] = useState(0);
  const [seats, setSeats] = useState(1);
  const [high, setHigh] = useState(100);
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [initialDate, setInitialDate] = useState(constVar.initialDate);
  const [endDate, setEndDate] = useState(constVar.endDate);
  const [hasReturnDate, setHasReturnDate] = useState(false);
  const [rangeDate, setRangeDate] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [favOffset, setFavOffset] = useState(0);
  const [openSearch, setOpenSearch] = useState({
    from: true,
    open: false,
    addStops: false,
  });
  const [notificationsModalOpen, setNotificationModalOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const [allowPet, setAllowPet] = useState(false);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [modalInfo, setModalInfo] = useState(initialModalInfoState);

  const handleValueChange = useCallback((low, high) => {
    setCost(low);
    setHigh(high);
  }, []);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const scrollRef = useRef();
  const isKeyBoardOpen = useKeyboard();
  let tooltipRef = useRef();

  const post = useSelector(state => state.postReducer);
  const myUser = useSelector(state => state.authReducer.user);

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  useEffect(() => {
    if (openSearch.open) {
      dispatch({type: HIDE_BOTTOM_TAB, payload: true});
    } else {
      dispatch({type: HIDE_BOTTOM_TAB, payload: false});
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
    dispatch({type: CLEAR_ALL, payload: {}});
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

  const valid = () => {
    if (post.startplace === '' || post.endplace === '') {
      setInfoMessage({
        info: 'Πρέπει να επιλέξεις αρχικό και τελικό προορισμό!',
        success: false,
      });
      showCustomLayout();
      return false;
    }

    if (rangeDate) {
      if (
        post?.startdate === constVar.initialDate ||
        post?.enddate === constVar.endDate
      ) {
        setInfoMessage({
          info: 'Πρέπει να επιλέξεις ημερομηνίες αναχώρησης!',
          success: false,
        });
        showCustomLayout();
        return false;
      }
    } else {
      if (post?.startdate === constVar.initialDate) {
        setInfoMessage({
          info: 'Πρέπει να επιλέξεις ημερομηνία αναχώρησης!',
          success: false,
        });
        showCustomLayout();
        return false;
      }
    }

    if (hasReturnDate) {
      if (
        post?.returnStartDate === constVar.returnStartDate &&
        post?.returnEndDate !== constVar.returnEndDate
      ) {
        setInfoMessage({
          info: 'Πρέπει να επιλέξεις αρχική ημερομηνία επιστροφής!',
          success: false,
        });
        showCustomLayout();
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
            ? null
            : moment(post.returnEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        withReturn: getHasReturnDate(),
        costperseat: cost,
        comment: comment,
        petAllowed: allowPet,
        moreplaces: post.moreplaces,
        isFavourite: 0,
      },
    };

    createPost({
      data: send,
      successCallback: (message, postid) => {
        //setInfoMessage({ info: message, success: true })
        setModalInfo({
          preventActionText: 'Όχι',
          buttonText: 'Προσθήκη',
          description: constVar.askForPostsFavorites,
          postid: postid,
        });
        setModalCloseVisible(true);
        // showCustomLayout()
      },
      errorCallback: errorMessage => {
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  const onStartPointChanged = value => {
    setData({...data, startPoint: value});
  };

  const getPlace = (place_id, place, isStartPoint) => {
    getPlaceInfo({
      place_id,
      successCallback: coordinates => {
        if (openSearch.from !== true && post.startcoord === coordinates) {
          setInfoMessage({
            info: 'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως αρχικό προορισμό!',
            success: false,
          });
          showCustomLayout();
          return;
        }

        if (openSearch.from === true && post.endcoord === coordinates) {
          setInfoMessage({
            info: 'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως τελικό προορισμό!',
            success: false,
          });
          showCustomLayout();
          return;
        }

        if (post.moreplaces.find(obj => obj.placecoords === coordinates)) {
          setInfoMessage({
            info: 'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως ενδιάμεση στάση!',
            success: false,
          });
          showCustomLayout();
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
  function renderSeats() {
    return (
      <View>
        <Text
          style={{
            marginBottom: 15,
            marginTop: 25,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
          }}>
          Αριθμός θέσεων
        </Text>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={leftAddSeat}
            onPress={() => seats > 1 && setSeats(seats - 1)}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{marginHorizontal: 10, fontSize: 20}}>{seats}</Text>
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
        <Text
          style={{
            marginBottom: 15,
            marginTop: 25,
            color: 'black',
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
          }}>
          Ελάχιστο κόστος
        </Text>

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
        />
      </View>
    );
  }

  function renderStops() {
    let morePlaces =
      typeof post.moreplaces == 'string'
        ? post.moreplaces.length > 0
          ? [...Array.from(JSON.parse(post?.moreplaces))]
          : []
        : post.moreplaces;

    return (
      <View>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'center',
          }}>
          Στάσεις που μπορώ να κάνω
        </Text>
        <Spacer height={15} />
        <View style={{marginBottom: 15}}>
          {morePlaces &&
            morePlaces.map((item, index) => (
              <View
                key={index}
                style={{
                  marginStart: 16,
                  marginVertical: 5,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Entypo
                    name="location-pin"
                    size={24}
                    color={colors.colorPrimary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      alignSelf: 'center',
                      marginStart: 10,
                    }}>
                    {item.place.split(',')[0]}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    dispatch({
                      type: REMOVE_MIDDLE_STOP,
                      payload: item.placecoords,
                    });
                  }}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={24}
                    color={'red'}
                    style={{alignSelf: 'center', marginEnd: 8}}
                  />
                </TouchableOpacity>
              </View>
            ))}
        </View>

        <RoundButton
          containerStyle={[
            addStopStyle,
            {alignSelf: 'center', justifyContent: 'center'},
          ]}
          leftIcon={true}
          text={'Προσθήκη'}
          onPress={() => {
            setOpenSearch({from: true, open: true, addStops: true});
          }}
          backgroundColor={colors.colorPrimary}
        />
      </View>
    );
  }

  const addPostToFav = postid => {
    addRemovePostToFavorites({
      postid: modalInfo.postid,
      successCallback: message => {
        dispatch(
          getFavoritePosts(postsAmount => {
            setTimeout(() => {
              postsAmount === 1 && toggleTooltip();
            }, 1200);
          }),
        );
        setModalCloseVisible(false);
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: message => {
        setModalCloseVisible(false);
        setInfoMessage({info: message, success: false});
        showCustomLayout();
      },
    });
  };

  const setRadioSelection = option => {
    dispatch({
      type: SET_RADIO_SELECTED,
      payload: option,
    });
  };

  const toggleTooltip = () => {
    setTimeout(() => {
      tooltipRef.current.toggleTooltip();
    }, 1000);
  };

  const {leftAddSeat, rightAddSeat, amountLabel, addStopStyle} = styles;
  return (
    <BaseView
      showStatusBar={true}
      statusBarColor={colors.colorPrimary}
      removePadding>
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
          favoriteXOffset={offset => {
            setFavOffset(offset);
          }}
          showFavTooltip={true}
          showStatusBar={true}
          isCreatePost={true}
          onSettingsPress={() => {
            navigation.navigate(routes.SETTINGS_SCREEN, {email: myUser.email});
          }}
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
          onLogout={() => {
            resetValues(() => {
              navigation.navigate(routes.AUTHSTACK, {
                screen: routes.LOGIN_SCREEN,
              });
            });
          }}
          onFilterPress={() => {
            setIsModalVisible(true);
          }}
          onFavoritePostsPress={() => {
            // toggleTooltip();
            navigation.navigate(routes.FAVORITE_POSTS_SCREEN);
          }}
        />
      </Tooltip>
      {myUser.car !== null ? (
        <KeyboardAwareScrollView
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          ref={scrollRef}
          style={{}}>
          <View>
            <View style={{paddingHorizontal: 16, marginTop: 15}}>
              <SelectLocationComponent
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
              <Spacer height={10} />
              <HorizontalLine />
              {renderSeats()}
              <HorizontalLine containerStyle={{marginVertical: 10}} />
              {renderCost()}
            </View>
            <Spacer height={15} />
          </View>
          <HorizontalLine containerStyle={{marginVertical: 10}} />
          <Spacer height={10} />

          <TouchableWithoutFeedback
            onPress={() => {
              setAllowPet(!allowPet);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text style={{color: '#8b9cb5', alignSelf: 'center'}}>
              δεκτά κατοικίδια {allowPet == true ? '👍' : '👎'}
            </Text>
          </TouchableWithoutFeedback>

          <Spacer height={10} />
          <HorizontalLine containerStyle={{marginVertical: 10}} />

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
            onIconPress={() => {
              setTimeout(() => {
                scrollRef.current.scrollToEnd({animated: true});
              }, 200);
            }}
          />

          <CommentInputComponent
            onFocus={() => {
              setTimeout(() => {
                scrollRef.current.scrollToEnd({animated: true});
              }, 400);
            }}
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
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 20,
          }}>
          <Text style={{textAlign: 'center'}}>{constVar.forbidDreatePost}</Text>
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
      <FiltersModal
        isVisible={isModalVisible}
        description={constVar.changePassDescription}
        buttonText={constVar.go}
        closeAction={() => {
          setIsModalVisible(false);
        }}
        buttonPress={() => {}}
        descrStyle={true}
        onChangeText={() => {}}
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
    borderRadius: 22,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.colorPrimary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  timer: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: 'white',
    height: 'auto',
    width: '100%',
    borderRadius: 23,
  },
  header: {
    fontSize: 23,
    alignSelf: 'center',
    marginStart: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  wrongPass: {
    fontSize: 13,
    fontWeight: '900',
    color: 'red',
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  absolute: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    top: 0,
  },
  box: {
    width: 55,
    alignSelf: 'center',

    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 8,
    color: 'black',
  },
});
