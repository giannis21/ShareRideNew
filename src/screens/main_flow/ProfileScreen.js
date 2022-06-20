import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Pressable,
} from 'react-native';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';
import { colors } from '../../utils/Colors';
import { Loader } from '../../utils/Loader';
import { MainHeader } from '../../utils/MainHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StarsRating } from '../../utils/StarsRating';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { PictureComponent } from '../../components/PictureComponent';
import { getValue, keyNames, setValue } from '../../utils/Storage';
import { RatingDialog } from '../../utils/RatingDialog';
import {
  getInterestedInMe,
  getUsersToRate,
  rateUser,
  searchUser,
  updateProfile,
} from '../../services/MainServices';
import { CustomInfoLayout } from '../../utils/CustomInfoLayout';
import { BASE_URL } from '../../constants/Constants';
import { constVar } from '../../utils/constStr';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import { Animated, Easing } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RoundButton } from '../../Buttons/RoundButton';
import { ADD_AVERAGE, SET_PROFILE_PHOTO, UPDATE_USER } from '../../actions/types';
import { TextInput } from 'react-native-gesture-handler';
import {
  carBrands,
  newCarBrands,
  onLaunchCamera,
  onLaunchGallery,
  range,
} from '../../utils/Functions';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { routes } from '../../navigation/RouteNames';
import { DATA_USER_TYPE, regex } from '../../utils/Regex';
import { DataSlotPickerModal } from '../../utils/DataSlotPickerModal';
import { HorizontalLine } from '../../components/HorizontalLine';
import { ViewRow } from '../../components/HOCS/ViewRow';
import { CustomText } from '../../components/CustomText';
import RNFetchBlob from 'rn-fetch-blob';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import { CustomIcon } from '../../components/CustomIcon';
import {
  isEmailContainedInUsersRates,
  isReviewToEdit,
} from '../../customSelectors/GeneralSelectors';
import Tooltip from '../../components/tooltip/Tooltip';
import { CommonStyles } from '../../layout/CommonStyles';
const ProfileScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const { halfLine, titleStyle } = CommonStyles;
  const myUser = useSelector(state => state.authReducer.user);
  const content = useSelector(state => state.contentReducer.content);

  let tooltipRef = useRef();

  let emailContainedInUsersRates = useSelector(
    isEmailContainedInUsersRates(route?.params?.email),
  );

  // i am checking if the current profile belongs to users to rate. If so, checking toEdit field
  //in order to show different message
  let editReview = useSelector(isReviewToEdit(route?.params?.email));

  let initalData = {
    email: '',
    facebook: '',
    initialFacebook: '',
    instagram: '',
    initialInstagram: '',
    carBrand: content.all1,
    initialCarBrand: content.all1,
    carDate: '',
    initialCarDate: '',
    fullName: '',
    initialFullname: '',
    phone: '',
    isPhoneVisible: null,
    initialPhone: '',
    age: '',
    initialAge: '',
    gender: 'man',
    image: '',
    hasInterested: false,
    hasReviews: false,
    hasPosts: false,
    count: 0,
    average: null,
    interestedForYourPosts: false,
    hasRequests: false,
  };

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [allowScroll, setAllowScroll] = useState(true);
  const [data, setData] = useState(initalData);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ info: '', success: false });
  const [rating, setCurrentRating] = useState(null);
  const [showRatingsInOtherProf, setShowRatingsInOtherProf] = useState(false);
  const [isRatingDialogOpened, setRatingDialogOpened] = useState(false);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(content.selectAge);
  const [userViewRate, setUserViewRate] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const { width } = Dimensions.get('window');

  const [editProfile, setEditProfile] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [pickerData, setPickerData] = useState([]);
  const dispatch = useDispatch();

  const scrollRef = useRef();

  const onTextsChanged = (val, icon) => {
    switch (icon) {
      case 'phone': {
        setData({ ...data, phone: val });
        break;
      }
      case 'age': {
        setData({ ...data, age: val });
        break;
      }
      case 'facebook': {
        setData({ ...data, facebook: val });
        break;
      }
      case 'instagram': {
        setData({ ...data, instagram: val });
        break;
      }
    }
  };

  const showPhone = () => {
    return myUser.email === route.params?.email || data.isPhoneVisible;
  };

  const [isSafeClick, setSafeClick] = useState(true);

  const safeClickListener = callback => {
    setSafeClick(false);
    setTimeout(function () {
      setSafeClick(true);
    }, 2000);
  };

  const showSubTitle = (subTitle, icon) => {
    if (icon !== 'phone' || showPhone()) return subTitle;

    return content.notVisibleTillGetApproval;
  };

  const getColorOrTitle = (icon, type, title) => {
    switch (icon) {
      case 'phone': {
        switch (type) {
          case DATA_USER_TYPE.LINE_COLOR:
            return regex.phoneNumber.test(data.phone)
              ? colors.colorPrimary
              : 'red';
          case DATA_USER_TYPE.TITLE_COLOR:
            return regex.phoneNumber.test(data.phone)
              ? colors.title_grey
              : 'red';
          case DATA_USER_TYPE.TITLE:
            return regex.phoneNumber.test(data.phone)
              ? title
              : content.phoneIncorrect;
        }
      }
      case 'facebook': {
        switch (type) {
          case DATA_USER_TYPE.LINE_COLOR:
            return data.facebook.length >= 3 || data.facebook === '-'
              ? colors.colorPrimary
              : 'red';
          case DATA_USER_TYPE.TITLE_COLOR:
            return data.facebook.length >= 3 || data.facebook === '-'
              ? colors.title_grey
              : 'red';
          case DATA_USER_TYPE.TITLE:
            return data.facebook.length >= 3 || data.facebook === '-'
              ? title
              : content.instagramIncorrect;
        }
      }
      case 'instagram': {
        switch (type) {
          case DATA_USER_TYPE.LINE_COLOR:
            return regex.instagram.test(data.instagram) ||
              data.instagram === '-'
              ? colors.colorPrimary
              : 'red';
          case DATA_USER_TYPE.TITLE_COLOR:
            return regex.instagram.test(data.instagram) ||
              data.instagram === '-'
              ? colors.title_grey
              : 'red';
          case DATA_USER_TYPE.TITLE:
            return regex.instagram.test(data.instagram) ||
              data.instagram === '-'
              ? title
              : content.instagramIncorrect;
        }
      }
      default: {
        switch (type) {
          case DATA_USER_TYPE.LINE_COLOR:
            return colors.colorPrimary;
          case DATA_USER_TYPE.TITLE_COLOR:
            return colors.title_grey;
          case DATA_USER_TYPE.TITLE:
            return title;
        }
      }
    }
    return title;
  };

  const resetToInitialState = () => {
    setEditProfile(!editProfile);
    setData({
      ...data,
      phone: data.initialPhone,
      facebook: data.initialFacebook,
      instagram: data.initialInstagram,
      age: data.initialAge,
      carBrand: data.initialCarBrand,
      carDate: data.initialCarDate,
    });
  };

  const onActionSheet = index => {
    switch (index) {
      case 0:
        return onLaunchCamera(data => {
          setImageModalVisible(false);
          if (data !== 'error') setSingleFile(data);
        });
      case 1:
        return onLaunchGallery(data => {
          setImageModalVisible(false);
          if (data !== 'error') setSingleFile(data);
        });
      case 2: {
        setSingleFile(null);
        return null;
      }
    }
  };

  const setUserData = async data => {
    if (route.params?.email === myUser.email || data.reviewAble === false)
      //this is my profile
      setUserViewRate(false);

    if (!_.isNull(data.average)) setCurrentRating(data.average.toString());
    else setCurrentRating('0');

    setData({
      email: data?.user?.email,
      phone: data.user.mobile ?? '-',
      initialPhone: data.user.mobile ?? '-',
      age: data.user.age,
      initialAge: data.user.age,
      facebook: data.user.facebook ?? '-',
      initialFacebook: data.user.facebook ?? '-',
      instagram: data.user.instagram ?? '-',
      initialInstagram: data.user.instagram ?? '-',
      carBrand: data.user.car ?? '-',
      initialCarBrand: data.user.car ?? '-',
      carDate: data.user.cardate ?? '-',
      initialCarDate: data.user.cardate ?? '-',
      fullName: data.user.fullname ?? '-',
      initialFullname: data.user.fullname ?? '-',
      image: BASE_URL + data.image ?? '-',
      hasInterested: data.hasInterested,
      hasReviews: data.count > 0,
      hasPosts: data.hasPosts,
      count: data.count,
      interestedForYourPosts: data.interestedForYourPosts,
      hasRequests: data.hasRequests,
      isPhoneVisible: data.isVisible,
    });

    if (emailContainedInUsersRates) {
      setTimeout(() => {
        setRatingDialogOpened(true);
      }, 700);
    }

    if (myUser.email === data.email)
      dispatch({
        type: ADD_AVERAGE,
        payload: { average: data.average, count: data.count },
      });
  };

  useEffect(() => {
    searchUser({
      email: route.params.email,
      successCallback: searchUserSuccessCallback,
      errorCallback: searchUserErrorCallback,
    });
  }, []);

  const searchUserSuccessCallback = async data => {
    setUserData(data);
  };
  const searchUserErrorCallback = () => { };
  const getInitialValue = () => {
    if (dataSlotPickerTitle === content.selectAge) {
      return data.age;
    } else if (dataSlotPickerTitle === content.selectCar) {
      return data.carBrand;
    } else {
      return data.carDate;
    }
  };

  const setDatePickerValues = selectedValue => {
    if (dataSlotPickerTitle === content.selectAge) {
      setData({ ...data, age: selectedValue });
    } else if (dataSlotPickerTitle === content.selectCar) {
      setData({ ...data, carBrand: selectedValue });
    } else {
      setData({ ...data, carDate: selectedValue });
    }
  };

  const rate = (rating, text) => {
    setIsLoading(true);
    rateUser({
      email: data.email,
      emailreviewer: myUser.email,
      rating: rating,
      text: text,
      editReview: editReview ? true : undefined,
      successCallback: ratingSuccessCallback,
      errorCallback: ratingErrorCallback,
    });
  };
  const ratingSuccessCallback = (message, average) => {
    setIsLoading(false);
    setShowRatingsInOtherProf(true);
    setUserViewRate(false);
    setRatingDialogOpened(false);
    setInfoMessage({ info: message, success: true });
    showCustomLayout();
    getUsersToRateIfNeeded();
  };

  const getUsersToRateIfNeeded = async () => {
    if (emailContainedInUsersRates) dispatch(getUsersToRate());
  };

  const openPicker = option => {
    if (option === 1) {
      setPickerData(range(18, 70));
      setDataSlotPickerTitle(content.selectAge);
      setDataSlotPickerVisible(true);
    } else if (option === 2) {
      setPickerData(['-'].concat(newCarBrands).concat(content.other));
      setDataSlotPickerTitle(content.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(
        ['-'].concat(range(2000, parseInt(moment().format('YYYY')))),
      );
      setDataSlotPickerTitle(content.selectCarAge);
      setDataSlotPickerVisible(true);
    }
  };
  const updateProfile1 = () => {
    let sendObj = {
      data: {
        mobile: data.phone,
        age: data.age,
        facebook: data.facebook,
        instagram: data.instagram,
        car: data.carBrand === '-' ? null : data.carBrand,
        cardate: data.carDate === '-' ? null : data.carDate === 'OTHER' ? 'ΑΛΛΟ' : data.carDate.toString(),
        photo: singleFile ? singleFile.data : undefined,
        fullname: data.fullName,
      },
    };
    setIsLoading(true);
    updateProfile({
      sendObj,
      successCallback: message => {
        setIsLoading(false);
        setEditProfile(false);
        singleFile && storeImageLocally();
        storeInfoLocally();
        addInfoToReducer();
        setInfoMessage({ info: message, success: true });
        showCustomLayout();
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        setEditProfile(false);
        setInfoMessage({ info: errorMessage, success: false });
        showCustomLayout();
      },
    });
  };

  const storeImageLocally = async () => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DCIMDir}/images/${myUser.email}.png`;
      RNFetchBlob.fs.writeFile(path, singleFile.data, 'base64');
      dispatch({ type: SET_PROFILE_PHOTO, payload: singleFile.data });
    } catch (err) { }
  };

  const ratingErrorCallback = message => {
    setIsLoading(false);
    setInfoMessage({ info: message, success: false });
    showCustomLayout(() => {
      setRatingDialogOpened(false);
    });
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  const handleScroll = event => {
    if (event.nativeEvent.contentOffset.y === 0) {
      setHeaderVisible(false);
      return;
    }

    if (headerVisible === false) setHeaderVisible(true);
  };

  const storeInfoLocally = async () => {
    setValue(keyNames.age, data.age);
    setValue(keyNames.car, data.carBrand);
    setValue(keyNames.carDate, data.carDate.toString());

    setValue(keyNames.facebook, data.facebook ?? '-');
    setValue(keyNames.fullName, data.fullName);

    setValue(keyNames.instagram, data.instagram ?? '-');
    setValue(keyNames.phone, data.phone.toString());
  };

  const toggleTooltip = (delay = 0) => {
    setTimeout(() => {
      tooltipRef.current.toggleTooltip();
    }, delay);
  };

  const addInfoToReducer = async () => {
    let updatedValues = {
      age: data.age,
      car: data.carBrand === '-' ? null : data.carBrand,
      carDate: data.carDate.toString() === '-' ? null : data.carDate.toString(),
      facebook: data.facebook,
      fullName: data.fullName,
      instagram: data.instagram,
      phone: data.phone,
      token: await getValue(keyNames.token),
    };
    dispatch({ type: UPDATE_USER, payload: updatedValues });
  };
  const validFields = () => {
    return (
      //if a field of car is filled i cannot proceed without filling the corresponding one
      !(
        (data.carBrand !== '-' && data.carDate === '-') ||
        (data.carBrand === '-' && data.carDate !== '-')
      ) &&
      //fullname validation
      data.fullName.length >= 3 &&
      //facebook validation
      (data.facebook.length >= 3 || data.facebook === '-') &&
      //instagram validation
      (regex.instagram.test(data.instagram) || data.instagram === '-') &&
      //phone validation
      regex.phoneNumber.test(data.phone) &&
      //comparing the current values with the initial ones
      (data.phone !== data.initialPhone ||
        data.age !== data.initialAge ||
        data.facebook !== data.initialFacebook ||
        data.instagram !== data.initialInstagram ||
        data.carBrand !== data.initialCarBrand ||
        data.carDate !== data.initialCarDate ||
        data.fullName !== data.initialFullname ||
        singleFile?.data)
    );
  };

  function RideInfo({ }) {
    return (
      <ViewRow
        style={{
          justifyContent: 'space-around',
          width: '100%',
        }}>
        <View style={{ alignItems: 'center' }}>
          <CustomIcon
            type="AntDesign"
            name="car"
            size={20}
            color={colors.Gray3}
          />
          <Spacer height={5} />
          <Text style={{ fontWeight: 'bold' }}>19</Text>
          <Text>{content.peopleDriven}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <CustomIcon
            type="Fontisto"
            name="persons"
            size={20}
            color={colors.Gray3}
          />
          <Spacer height={5} />
          <Text style={{ fontWeight: 'bold' }}>19</Text>

          <Text>{content.ridesTaken}</Text>
        </View>
      </ViewRow>
    );
  }
  function EditIcon({ }) {
    return (
      <TouchableOpacity
        style={editIconContainer}
        activeOpacity={1}
        onPress={resetToInitialState}>
        {!editProfile ? (
          <Entypo
            name="edit"
            color="black"
            size={24}
            style={{ alignSelf: 'center' }}
          />
        ) : (
          <EvilIcons
            name="close"
            color="black"
            size={30}
            style={{ alignSelf: 'center' }}
          />
        )}
      </TouchableOpacity>
    );
  }
  const navigateTo = (screenRoute) => {
    navigation.navigate(screenRoute, { email: data.email });
  }

  function ActionItem({ screenRoute, title }) {
    return (
      <TouchableOpacity
        onPress={() => navigateTo(screenRoute)}
        style={[
          styles.infoContainer,
          { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
        ]}>
        <Text style={styles.rates}>{title}</Text>
        <MaterialIcons
          name={'arrow-forward-ios'}
          size={15}
          style={{ marginStart: 10 }}
          color={colors.colorPrimary}
        />
      </TouchableOpacity>
    );
  }
  function getInputStyle(icon) {
    return {
      fontSize: showPhone() || icon !== 'phone' ? 15 : 12,
      fontWeight: 'bold',
      color: 'black',
      width: '100%',
      height: Platform.OS === 'ios' ? 33 : 37,
    };
  }
  function userInfo(icon, title, subTitle, editable, keyboardType) {
    return (
      <ViewRow style={{ marginHorizontal: 16, marginTop: 28 }}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={colors.colorPrimary}
        />
        <Spacer width={16} />
        <View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: getColorOrTitle(icon, DATA_USER_TYPE.TITLE_COLOR, title),
              opacity: 0.6,
            }}>
            {getColorOrTitle(icon, DATA_USER_TYPE.TITLE, title)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <TextInput
              maxLength={icon === 'phone' && showPhone() ? 10 : null}
              onChangeText={val => onTextsChanged(val, icon)}
              keyboardType={keyboardType ? 'numeric' : 'default'}
              editable={editable && !isTooltipVisible}
              style={getInputStyle(icon)}>
              {showSubTitle(subTitle, icon)}
            </TextInput>

            <View style={{ position: 'absolute', right: '23%' }}>
              {editProfile && icon === 'account-details' && (
                <AntDesign name={'caretdown'} size={16} color={colors.Gray3} />
              )}

              {icon === 'phone' && editProfile && (
                <CustomIcon
                  onPress={() => {
                    if (isSafeClick) {
                      setAllowScroll(false);
                      toggleTooltip(700);
                      safeClickListener();
                    }
                  }}
                  name="info"
                  type="Feather"
                  size={20}
                  color={colors.Gray3}
                />
              )}
            </View>

            {icon === 'account-details' && (
              <Pressable
                style={styles.pressabbleStyle}
                disabled={!editProfile}
                onPress={() => {
                  openPicker(1);
                }}
              />
            )}
          </View>

          {editProfile && icon !== 'email' && (
            <View
              style={{
                backgroundColor: getColorOrTitle(
                  icon,
                  DATA_USER_TYPE.LINE_COLOR,
                  title,
                ),
                height: 1,
                width: '80%',
              }}
            />
          )}
        </View>
      </ViewRow>
    );
  }
  function renderTopContainer() {
    return (
      <View style={topContainerStyle}>
        <Spacer height={5} />

        <CloseIconComponent
          containerStyle={closeIconStyle}
          showArrow={route.params?.showArrow}
          onPress={() => navigation.goBack()}
        />

        <ViewRow style={{ alignItems: 'center', justifyContent: 'center' }}>
          <PictureComponent
            singleFile={singleFile}
            url={singleFile ? null : data.image}
            imageSize={'medium'}
          />
          <Spacer width={5} />

          <View>
            <Text style={fullNameTopContainerText}>{data.fullName}</Text>

            {data?.count > 0 && (
              <StarsRating
                style={{ alignSelf: 'flex-start' }}
                rating={rating}
                size="small"
              />
            )}
          </View>
        </ViewRow>

        <Spacer height={5} />

        <HorizontalLine />

        {route.params?.email === myUser.email && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={resetToInitialState}
            style={editIconContainer}>
            {!editProfile ? (
              <CustomIcon
                type={'Entypo'}
                name="edit"
                size={24}
                style={{ alignSelf: 'center' }}
              />
            ) : (
              <CustomIcon
                name="close"
                color="black"
                size={30}
                style={{ alignSelf: 'center' }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
  function CarColumn({ column }) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={carInfoTitle}>
          {column === 1 ? content.carBrandTitle : content.carAgeLabel}
        </Text>

        <ViewRow style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextInput editable={false} style={carInfoSubtitle}>
            {column === 1 ? data.carBrand : data.carDate}
          </TextInput>

          {editProfile && (
            <AntDesign name={'caretdown'} size={16} color={colors.Gray3} />
          )}
        </ViewRow>

        {editProfile && (
          <HorizontalLine
            containerStyle={{ backgroundColor: colors.colorPrimary }}
          />
        )}
        <Pressable
          style={styles.pressabbleStyle}
          disabled={!editProfile}
          onPress={() => {
            openPicker(column === 1 ? 2 : 3);
          }}
        />
      </View>
    );
  }
  function CarDetails({ }) {
    return (
      <ViewRow style={{ marginHorizontal: 16 }}>
        <CarColumn column={1} />
        <CarColumn column={2} />
      </ViewRow>
    );
  }

  const {
    actionsContainer,
    baseView2,
    baseView1,
    topInfoContainer,
    ratesAmount,
    rateNowContainer,
    fullNameStyle,
    editIconContainer,
    carInfoTitle,
    carInfoSubtitle,
    topContainerStyle,
    fullNameTopContainerText,
    closeIconStyle,
  } = styles;

  return (
    <BaseView
      iosBackgroundColor={'transparent'}
      showStatusBar={true}
      statusBarColor={'black'}
      removePadding={true}
      containerStyle={isRatingDialogOpened ? baseView2 : baseView1}>
      <Loader isLoading={isLoading} />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
      <OpenImageModal
        isVisible={isImageModalVisible}
        closeAction={() => {
          setImageModalVisible(false);
        }}
        buttonPress={index => {
          onActionSheet(index);
        }}
      />
      <CloseIconComponent
        showArrow={route.params?.showArrow}
        onPress={() => {
          navigation.goBack();
        }}
        containerStyle={closeIconStyle}
      />
      {myUser.email === route.params.email && <EditIcon />}
      {data.email !== '' && (
        <KeyboardAwareScrollView
          scrollEnabled={allowScroll}
          showsVerticalScrollIndicator={false}
          height={400}
          ref={scrollRef}
          onScroll={handleScroll}>
          <View style={topInfoContainer}>
            <PictureComponent
              singleFile={singleFile}
              onCameraPress={() => {
                editProfile && setImageModalVisible(true);
              }}
              openCamera={editProfile ? true : false}
              url={singleFile ? null : data.image}
              imageSize={'big'}
            />
            <TextInput
              onChangeText={val => setData({ ...data, fullName: val })}
              editable={editProfile}
              value={data.fullName}
              style={fullNameStyle}
            />
            {editProfile && (
              <HorizontalLine
                containerStyle={{
                  backgroundColor:
                    data.fullName.length >= 3 ? colors.colorPrimary : 'red',
                  height: 1,
                  width: '100%',
                  marginBottom: 10,
                }}
              />
            )}

            <Spacer height={10} />
            {data.count > 0 && (
              <StarsRating
                rating={rating}
                setRating={rating => setCurrentRating(rating)}
              />
            )}

            {data.count > 0 && (
              <Text style={ratesAmount}>
                {data.count === 1
                  ? data.count + ` ${content.vote}`
                  : data.count + ` ${content.votes}`}
              </Text>
            )}

            <Spacer height={20} />
            <HorizontalLine />
            {userViewRate && (
              <Text
                onPress={() => setRatingDialogOpened(true)}
                style={rateNowContainer}>
                {content.rateNow}
              </Text>
            )}
            <Spacer height={6} />

            <RideInfo />

            <HorizontalLine
              containerStyle={{
                height: 6,
                backgroundColor: colors.CoolGray2,
                marginTop: 10,
              }}
            />
          </View>
          <View style={[titleStyle, { marginTop: 20 }]}>
            <CustomText type={'title1'} text={content.personalInfo} />
          </View>

          {route.params?.email === myUser.email &&
            userInfo('email', constVar.email, data.email, false)}

          <Tooltip
            disabled={true}
            ref={tooltipRef}
            height={84}
            width={width / 1.2}
            skipAndroidStatusBar={true}
            isTooltipVisible={isVisible => {
              setTooltipVisible(isVisible);
              if (!isVisible) {
                setAllowScroll(true);
              }
            }}
            backgroundColor={colors.colorPrimary}
            pointerColor={colors.colorPrimary}
            toggleOnPress={false}
            trianglePosition="middle"
            popover={
              <Text style={{ color: 'white' }}>{content.tooltipPhoneText}</Text>
            }>
            {userInfo(
              'phone',
              content.mobile,
              data.phone,
              editProfile ? true : false,
              'numeric',
            )}
          </Tooltip>

          {userInfo(
            'account-details',
            content.age,
            data.age,
            false,
            'numeric',
          )}
          <View style={[titleStyle, { marginTop: 15 }]}>
            <CustomText type={'title1'} text={content.socialTitle} />
          </View>

          {userInfo(
            'facebook',
            content.facebook,
            data.facebook,
            editProfile ? true : false,
          )}

          {userInfo(
            'instagram',
            content.instagram,
            data.instagram,
            editProfile ? true : false,
          )}
          <View style={[titleStyle, { marginTop: 20, marginBottom: 20 }]}>
            <CustomText type={'title1'} text={content.carTitle} />
          </View>

          <CarDetails />

          {(((data.hasInterested ||
            data.hasPosts ||
            data.hasReviews ||
            data.interestedForYourPosts) &&
            myUser.email === data.email) ||
            showRatingsInOtherProf ||
            (myUser.email !== data.email && data.hasReviews)) && (
              <View style={{ marginTop: 20, marginHorizontal: 16, padding: 3 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>
                  {content.seeAlso}
                </Text>
                <View style={actionsContainer}>
                  {(data.hasReviews || showRatingsInOtherProf) && (
                    <ActionItem
                      screenRoute={routes.RATINGS_PROFILE_SCREEN}
                      title={content.reviews}
                    />
                  )}

                  {data.hasPosts && myUser.email === data.email && (
                    <ActionItem
                      screenRoute={routes.MYPOSTS_PROFILE_SCREEN}
                      title={content.myRides}
                    />
                  )}

                  {data.hasInterested && myUser.email === data.email && (
                    <ActionItem
                      screenRoute={routes.POSTS_INTERESTED_PROFILE_SCREEN}
                      title={content.ridesInterestedIn}
                    />
                  )}

                  {data.hasRequests && myUser.email === data.email && (
                    <ActionItem
                      screenRoute={routes.REQUESTS_PROFILE_SCREEN}
                      title={content.notificationRequests}
                    />
                  )}
                </View>
              </View>
            )}

          <Spacer height={20} />
        </KeyboardAwareScrollView>
      )}
      <RatingDialog
        editReview={editReview}
        onSubmit={(rating, text) => rate(rating, text)}
        isVisible={isRatingDialogOpened}
        closeAction={() => {
          setRatingDialogOpened(false);
        }}
      />
      {data.image !== '' && headerVisible && renderTopContainer()}
      {editProfile && (
        <RoundButton
          disabled={!validFields()}
          containerStyle={{ bottom: 10, marginHorizontal: 10 }}
          text={content.update}
          onPress={updateProfile1}
          backgroundColor={colors.colorPrimary}
        />
      )}
      <DataSlotPickerModal
        data={pickerData}
        title={dataSlotPickerTitle}
        isVisible={dataSlotPickerVisible}
        onClose={() => {
          setDataSlotPickerVisible(false);
        }}
        onConfirm={(selectedValue, secValue, thirdValue) => {
          setDatePickerValues(selectedValue);
          setDataSlotPickerVisible(false);
        }}
        initialValue1={getInitialValue()}
      />
    </BaseView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  closeIconStyle: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 10,
    marginStart: 10,
  },
  carInfoSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    width: '80%',
    textAlign: 'center',
    height: Platform.OS === 'ios' ? 30 : 37,
  },
  carInfoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#595959',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 5,
  },
  fullNameTopContainerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  editIconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    right: 9,
    top: 16,
    zIndex: 1,
    position: 'absolute',
  },
  fullNameStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    width: '100%',
    height: Platform.OS === 'ios' ? 30 : 43,
    marginTop: 15,
  },
  pressabbleStyle: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 35 : 10,
  },
  baseView1: {
    flex: 1,
    backgroundColor: 'white',
  },
  baseView2: {
    flex: 1,
    backgroundColor: 'rgba(37, 37, 33, 0.8)',
  },
  circle: {
    borderRadius: 100 / 2,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  ratesAmount: {
    fontSize: 13,
    backgroundColor: '#F0AD4E',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    width: 'auto',
    paddingHorizontal: 5,
    borderRadius: 6,
    paddingVertical: 1,
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
  },
  tabsStyle: {
    right: 0,
    left: 0,
    bottom: 0,
    marginHorizontal: 10,
    height: '100%',
  },
  actionsContainer: {
    backgroundColor: 'transparent',
    borderColor: colors.CoolGray2,
    borderWidth: 2,
    marginTop: 8,
    borderRadius: 10,
    paddingStart: 10,
    paddingBottom: 19,
    paddingTop: 10,
  },
  footerBtn: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'baseline',
    backgroundColor: colors.colorPrimary,
  },
  infoContainer: {
    alignSelf: 'baseline',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderColor: colors.colorPrimary,
    borderWidth: 1
  },
  dot: {
    marginLeft: 10,
    width: 6,
    height: 6,
    borderRadius: 100 / 2,
    backgroundColor: 'black',
  },
  rates: {
    fontSize: 15,
    marginLeft: 10,

    color: colors.colorPrimary,
    fontWeight: 'bold',
  },
  rateNowContainer: {
    padding: 3,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#F0AD4E',
    textAlign: 'center',
    width: '100%',
    color: 'white',
  },
  topContainerStyle: {
    position: 'absolute',
    height: 'auto',
    width: '100%',
    backgroundColor: 'white',
  },
});
