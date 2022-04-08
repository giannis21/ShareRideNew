import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Image,
  InteractionManager,
  PermissionsAndroid,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BaseView} from '../layout/BaseView';
import {Spacer} from '../layout/Spacer';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {RoundButton} from '../Buttons/RoundButton';
import {colors} from '../utils/Colors';
import {routes} from '../navigation/RouteNames';
import {uploadImage, registerUser} from '../services/AuthServices';
import {Loader} from '../utils/Loader';
import {CustomInput} from '../utils/CustomInput';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {
  carBrands,
  newCarBrands,
  onLaunchCamera,
  onLaunchGallery,
  range,
} from '../utils/Functions';
import {CheckBox} from 'react-native-elements';
import {OpenImageModal} from '../utils/OpenImageModal';
import {constVar} from '../utils/constStr';
import {PictureComponent} from '../components/PictureComponent';
import RNFetchBlob from 'rn-fetch-blob';
import {DataSlotPickerModal} from '../utils/DataSlotPickerModal';
import moment from 'moment';
import {HorizontalLine} from '../components/HorizontalLine';
import {ViewRow} from '../components/HOCS/ViewRow';
import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';

const RegisterScreen = ({navigation}) => {
  var _ = require('lodash');

  let initalData = {
    email: '',
    password: '',
    carBrand: null,
    checked: 'male',
    carDate: null,
    passwordConfirmed: '',
    secureTextEntry: true,
    secureTextEntryConfirmed: true,
    fullName: '',
    phone: '',
    age: '',
    gender: 'man',
  };
  const [data, setData] = useState(initalData);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInput, setModalInput] = useState(false);
  const [areFieldsOkay, setAreFieldsOkay] = useState({
    areEmpty: false,
    isPasswordValid: true,
    isEmailValid: true,
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );
  const [open, setOpen] = useState(false);
  const [allowScroll, setAllowScroll] = useState(true);
  const [items, setItems] = useState(carBrands);
  const [value, setValue] = useState(null);
  const actionSheetRef = useRef();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setData(initalData);
    });

    return unsubscribe;
  }, [navigation]);

  const getInitialValue = () => {
    if (dataSlotPickerTitle === constVar.selectAge) {
      return parseInt(data.age);
    } else if (dataSlotPickerTitle === constVar.selectCar) {
      return data.carBrand;
    } else {
      return parseInt(data.carDate);
    }
  };

  const openPicker = option => {
    if (option === 1) {
      setPickerData(range(18, 70));
      setDataSlotPickerTitle(constVar.selectAge);
      setDataSlotPickerVisible(true);
    } else if (option === 2) {
      setPickerData(_.tail(newCarBrands));
      setDataSlotPickerTitle(constVar.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(range(2000, parseInt(moment().format('YYYY'))));
      setDataSlotPickerTitle(constVar.selectCarAge);
      setDataSlotPickerVisible(true);
    }
  };

  const storeImageLocally = async () => {
    try {
      const path = `${RNFetchBlob.fs.dirs.DocumentDir}/images/${data.email}.png`;
      const data = await RNFetchBlob.fs.writeFile(
        path,
        singleFile.data,
        'base64',
      );
      setSingleFile(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onRegister = async () => {
    if (!valid()) return;

    setIsLoading(true);
    registerUser(
      data,
      singleFile.data,

      //success callback
      (message, otp) => {
        storeImageLocally();
        setIsLoading(false);
        setInfoMessage({info: message, success: true});
        showCustomLayout(() => {
          navigation.navigate(routes.OTP_SCREEN, {
            _otp: otp,
            _email: data.email,
            goToRestore: false,
          });
        });
      },
      //error callback
      error => {
        setIsLoading(false);
        setInfoMessage({info: error, success: false});
        showCustomLayout();
      },
    );
  };

  const valid = () => {
    if (
      _.isEmpty(data.email) ||
      _.isEmpty(data.password) ||
      // _.isEmpty(data.carBrand) ||
      // _.isEmpty(data.carDate) ||
      _.isEmpty(data.passwordConfirmed) ||
      _.isEmpty(data.phone) ||
      _.isEmpty(data.age) ||
      _.isEmpty(data.fullName)
    ) {
      setInfoMessage({info: 'Συμπλήρωσε τα πεδία πρώτα.', success: false});
      showCustomLayout();
      return false;
    }

    if (!_.isEqual(data.password, data.passwordConfirmed)) {
      setInfoMessage({
        info: 'Ο κωδικος με τον κωδικό επιβεβαίωσης είναι διαφορετικοί.',
        success: false,
      });
      showCustomLayout();
      return false;
    }

    if (data.password.length < 5 || data.passwordConfirmed.length < 5) {
      setInfoMessage({
        info: 'Ο κωδικός αποτελείται απο τουλάχιστον 5 χαρακτήρες.',
        success: false,
      });
      showCustomLayout();
      return false;
    }

    if (_.isNull(singleFile)) {
      setInfoMessage({info: 'Δεν έχεις προσθέσει φωτογραφία.', success: false});
      showCustomLayout();
      return false;
    }

    return true;
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);

    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 3000);
  };
  const onEmailChanged = value => {
    setData({...data, email: value});
  };
  const onPhoneChanged = value => {
    setData({...data, phone: value});
  };
  const onFullNameChanged = value => {
    setData({...data, fullName: value});
  };
  const oncarDateChanged = value => {
    setData({...data, carDate: value});
  };
  const onAgeChanged = value => {
    setData({...data, age: value});
  };
  const onPasswordChanged = value => {
    setData({...data, password: value});
  };
  const onPasswordConfirmedChanged = value => {
    setData({...data, passwordConfirmed: value});
  };
  const updateSecureTextEntry = () => {
    setData({...data, secureTextEntry: !data.secureTextEntry});
  };
  const updateSecureTextEntryConfirmed = () => {
    setData({
      ...data,
      secureTextEntryConfirmed: !data.secureTextEntryConfirmed,
    });
  };

  const onActionSheet = index => {
    switch (index) {
      case 0:
        return onLaunchCamera(data => {
          setSingleFile(data);
        });
      case 1:
        return onLaunchGallery(data => {
          setSingleFile(data);
        });
      case 2: {
        setSingleFile(null);
        return null;
      }
    }
  };
  const setDatePickerValues = selectedValue => {
    if (dataSlotPickerTitle === constVar.selectAge) {
      setData({...data, age: selectedValue});
    } else if (dataSlotPickerTitle === constVar.selectCar) {
      setData({...data, carBrand: selectedValue});
    } else {
      setData({...data, carDate: selectedValue});
    }
  };
  const requestIosPermission = () => {
    request(PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            setIsModalVisible(true);
            break;
          case RESULTS.BLOCKED:
            break;
        }
      })
      .catch(error => {});
  };

  const requestAndroidPermission = () => {
    check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case PermissionsAndroid.RESULTS.GRANTED:
            setIsModalVisible(true);
            break;
          default:
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onImageClick = () => {
    if (Platform.OS === 'android') {
      requestAndroidPermission();
    } else {
      requestIosPermission();
    }
  };
  return (
    <BaseView statusBarColor={colors.colorPrimary}>
      <Loader isLoading={false} />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />

      <KeyboardAwareScrollView
        scrollEnabled={allowScroll}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}>
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 35,
            }}>
            <PictureComponent
              singleFile={singleFile}
              openCamera={true}
              onPress={onImageClick}
              imageSize={'big'}
            />
          </View>

          <CustomInput
            text={constVar.hereEmail}
            keyboardType="email-address"
            onChangeText={onEmailChanged}
            value={data.email}
          />

          <CustomInput
            text={constVar.fullName}
            keyboardType="default"
            onChangeText={onFullNameChanged}
            value={data.fullName}
          />
          <CustomInput
            text={constVar.phone}
            keyboardType="numeric"
            onChangeText={onPhoneChanged}
            value={data.phone}
          />
          <CustomInput
            onPressIn={() => {
              openPicker(1);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={constVar.age}
            value={data.age}
          />
          <Spacer height={16} />
          <ViewRow>
            <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Φύλο</Text>
            <Spacer width={16} />
            <CheckBox
              center
              title={constVar.man}
              checkedIcon="check-square-o"
              uncheckedIcon="square-o"
              checked={data.checked === 'male' ? true : false}
              onPress={() => setData({...data, checked: 'male'})}
            />
            <CheckBox
              center
              title={constVar.woman}
              checkedIcon="check-square-o"
              uncheckedIcon="square-o"
              checked={data.checked === 'female' ? true : false}
              onPress={() => setData({...data, checked: 'female'})}
            />
          </ViewRow>

          <CustomInput
            text={constVar.herePass}
            keyboardType="default"
            secureTextEntry={data.secureTextEntry ? true : false}
            onChangeText={onPasswordChanged}
            onIconPressed={updateSecureTextEntry}
            hasIcon={true}
            value={data.password}
          />

          <CustomInput
            text={constVar.confirmPass}
            keyboardType="default"
            secureTextEntry={data.secureTextEntryConfirmed ? true : false}
            onChangeText={onPasswordConfirmedChanged}
            onIconPressed={updateSecureTextEntryConfirmed}
            hasIcon={true}
            value={data.passwordConfirmed}
          />
          <Spacer height={6} />
          <Text style={{fontSize: 13, color: '#8b9cb5'}}>
            {constVar.passLengthNote}
          </Text>

          <HorizontalLine containerStyle={{marginVertical: 26}} />

          <Text style={{alignSelf: 'center', fontSize: 19, fontWeight: 'bold'}}>
            {constVar.carTitle}
          </Text>
          <Spacer height={6} />

          <CustomInput
            onPressIn={() => {
              openPicker(2);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={constVar.carBrand}
            keyboardType="numeric"
            value={data.carBrand}
          />

          <CustomInput
            onPressIn={() => {
              openPicker(3);
            }}
            hasBottomArrow={true}
            disabled={true}
            text={constVar.carAgeLabel}
            keyboardType="default"
            onChangeText={oncarDateChanged}
            value={data.carDate}
          />

          <Spacer height={50} />
          <RoundButton
            text={constVar.register}
            onPress={onRegister}
            backgroundColor={colors.colorPrimary}
          />
          <Spacer height={16} />

          <RoundButton
            text={constVar.login}
            textColor={colors.colorPrimary.toString()}
            onPress={() => navigation.navigate(routes.LOGIN_SCREEN)}
          />

          <Spacer height={26} />
        </View>
      </KeyboardAwareScrollView>
      <OpenImageModal
        isVisible={isModalVisible}
        closeAction={() => {
          setIsModalVisible(false);
        }}
        buttonPress={index => {
          setIsModalVisible(false);
          onActionSheet(index);
        }}
      />
      <DataSlotPickerModal
        data={pickerData}
        title={dataSlotPickerTitle}
        isVisible={dataSlotPickerVisible}
        onClose={() => {
          setDataSlotPickerVisible(false);
        }}
        onConfirm={(selectedValue, secValue, thirdValue) => {
          setDatePickerValues(selectedValue.toString());
          setDataSlotPickerVisible(false);
        }}
        initialValue1={getInitialValue()}
      />
    </BaseView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  circle: {
    borderRadius: 100 / 2,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  maskInputContainer: {
    marginVertical: Platform.OS === 'ios' ? 13 : 20,
    paddingVertical: Platform.OS === 'ios' ? 0 : 20,
    fontSize: 14,
    backgroundColor: 'black',
  },
});
