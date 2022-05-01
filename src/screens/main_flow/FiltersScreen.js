import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CloseIconComponent} from '../../components/CloseIconComponent';
import Slider from 'rn-range-slider';
import Thumb from '../../components/rangePicker/Thumb';
import Rail from '../../components/rangePicker/Rail';
import RailSelected from '../../components/rangePicker/RailSelected';
import Label from '../../components/rangePicker/Label';
import Notch from '../../components/rangePicker/Notch';
import {carBrands, newCarBrands, range} from '../../utils/Functions';
import {colors} from '../../utils/Colors';

import {RoundButton} from '../../Buttons/RoundButton';
import {CustomRadioButton} from '../../components/CustomRadioButton';
import {useIsFocused} from '@react-navigation/native';
import {filterKeys, getValue, setValue} from '../../utils/Storage';
import {CalendarPickerModal} from '../../utils/CalendarPickerModal';
import {
  ADD_DATES_FILTERS,
  REMOVE_DATES_FILTERS,
  SET_RADIO_SELECTED_FILTERS,
} from '../../actions/types';
import {useSelector, useDispatch} from 'react-redux';
import {constVar} from '../../utils/constStr';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import {DataSlotPickerModal} from '../../utils/DataSlotPickerModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {ViewRow} from '../../components/HOCS/ViewRow';
import {BaseView} from '../../layout/BaseView';
import {CustomIcon} from '../../components/CustomIcon';
import {LikeButton} from '../../components/LikeButton';
const FiltersScreen = ({navigation, route}) => {
  var _ = require('lodash');
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [carDate, setCarDate] = useState('2000');
  const [cost, setCost] = useState(0);
  const [open, setOpen] = useState(false);
  const [carValue, setCarValue] = useState('ΟΛΑ');
  const [items, setItems] = useState(carBrands);
  const [age, setAge] = useState(18);
  const [highAge, setHighAge] = useState(70);
  const [genre, setGenre] = useState('όλους');
  const [showGenres, setShowGenres] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [allowScroll, setAllowScroll] = useState(true);
  const [allowPet, setAllowPet] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [hasReturnDate, setHasReturnDate] = useState(false);
  const [rangeDate, setRangeDate] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    constVar.selectAge,
  );
  let dispatch = useDispatch();
  let isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) return;

    resetValues();
  }, [isFocused]);

  const openPicker = option => {
    if (option === 1) {
      setPickerData(range(18, 70));
      setDataSlotPickerTitle(constVar.selectAge);
      setDataSlotPickerVisible(true);
    } else if (option === 2) {
      setPickerData(newCarBrands);
      setDataSlotPickerTitle(constVar.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(range(2000, parseInt(moment().format('YYYY'))));
      setDataSlotPickerTitle(constVar.selectCarAge);
      setDataSlotPickerVisible(true);
    }
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  const handleValueChange = useCallback((low, high) => {
    setAge(low);
    setHighAge(high);
  }, []);

  const handleCostValueChange = useCallback((low, high) => {
    setCost(low);
  }, []);

  const filtersReducer = useSelector(state => state.filtersReducer);

  const closeOtherFilters = currentFilter => {
    if (currentFilter === 'genre') {
      setShowAge(false);
      setShowCost(false);
      setShowDate(false);
    } else if (currentFilter === 'age') {
      setShowGenres(false);
      setShowCost(false);
      setShowDate(false);
    } else if (currentFilter === 'cost') {
      setShowGenres(false);
      setShowDate(false);
      setShowAge(false);
    } else {
      setShowGenres(false);
      setShowAge(false);
      setShowCost(false);
    }
  };
  const setRadioSelection = option => {
    dispatch({
      type: SET_RADIO_SELECTED_FILTERS,
      payload: option,
    });
  };

  let goBack = () => {
    navigation.goBack();
  };
  const getInitialValue = () => {
    return dataSlotPickerTitle === constVar.selectCar ? carValue : carDate;
  };

  const addToStorage = async () => {
    if (
      filtersReducer?.returnStartDate !== constVar.returnStartDate ||
      filtersReducer?.startdate !== constVar.initialDate ||
      filtersReducer?.enddate !== constVar.endDate ||
      filtersReducer?.returnEndDate !== constVar.returnEndDate
    ) {
      if (
        filtersReducer?.returnStartDate === constVar.returnStartDate &&
        filtersReducer?.returnEndDate !== constVar.returnEndDate
      ) {
        setInfoMessage({
          info: 'Πρέπει να επιλέξεις αρχική ημερομηνία επιστροφής!',
          success: false,
        });
        showCustomLayout();
        return;
      }

      if (filtersReducer?.startdate === constVar.initialDate) {
        setInfoMessage({
          info: 'Πρέπει να επιλέξεις αρχική ημερομηνία αναχώρησης!',
          success: false,
        });
        showCustomLayout();
        return;
      }
    }

    try {
      await setValue(filterKeys.showMe, genre);
      await setValue(filterKeys.ageRange, age + '-' + highAge);
      await setValue(filterKeys.maxCost, cost.toString());
      await setValue(filterKeys.carMark, carValue.toString());
      await setValue(filterKeys.carAge, carDate.toString());
      await setValue(
        filterKeys.allowPet,
        allowPet.toString() === 'true'
          ? 'true'
          : allowPet.toString() === 'false'
          ? 'false'
          : 'null',
      );

      await setValue(filterKeys.startDate, filtersReducer.startdate);
      await setValue(filterKeys.endDate, filtersReducer.enddate);
      await setValue(
        filterKeys.returnStartDate,
        filtersReducer.returnStartDate,
      );
      await setValue(filterKeys.returnEndDate, filtersReducer.returnEndDate);
      navigation.goBack();
    } catch (err) {
      console.log({err});
    }
  };

  const resetValues = async () => {
    let allowPetVar =
      (await getValue(filterKeys.allowPet)) === 'true'
        ? true
        : (await getValue(filterKeys.allowPet)) === 'false'
        ? false
        : null;
    setCarValue((await getValue(filterKeys.carMark)) ?? 'ΟΛΑ');
    setGenre((await getValue(filterKeys.showMe)) ?? 'όλους');
    setCost((await getValue(filterKeys.maxCost)) ?? '100');
    console.log(
      ' (await getValue(filterKeys.allowPet))',
      await getValue(filterKeys.allowPet),
    );
    setAllowPet(allowPetVar);
    let ageRange = await getValue(filterKeys.ageRange);

    if (ageRange) {
      setAge(parseInt(ageRange.split('-')[0]));
      setHighAge(parseInt(ageRange.split('-')[1]));
    } else {
      setAge('18');
      setHighAge('70');
    }
    setCarDate((await getValue(filterKeys.carAge)) ?? '2000');

    dispatch({
      type: ADD_DATES_FILTERS,
      payload: [
        (await getValue(filterKeys.startDate)) ?? constVar.initialDate,
        (await getValue(filterKeys.endDate)) ?? constVar.endDate,
        (await getValue(filterKeys.returnStartDate)) ??
          constVar.returnStartDate,
        (await getValue(filterKeys.returnEndDate)) ?? constVar.returnEndDate,
      ],
    });
  };

  const {modal, container, item} = styles;
  return (
    <BaseView
      removePadding
      iosBackgroundColor={'transparent'}
      showStatusBar={true}
      statusBarColor={'black'}>
      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={true}
        bounces={true}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={allowScroll}
        style={container}>
        <View style={[item, {marginHorizontal: 16}]}>
          <CloseIconComponent onPress={goBack} />
          <Text
            style={{
              fontSize: 20,
              marginStart: 16,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Φίλτρα αναζήτησης
          </Text>
          <TouchableOpacity onPress={resetValues}>
            <Text style={{fontSize: 15, marginStart: 16, color: 'black'}}>
              reset
            </Text>
          </TouchableOpacity>
        </View>

        <View marginHorizontal={16}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              closeOtherFilters('genre');
              setShowGenres(!showGenres);
            }}
            style={item}>
            <Text style={{fontSize: 15, color: 'black'}}>Δείξε μου</Text>
            <Text style={{fontSize: 20, color: 'black'}}>{genre}</Text>
          </TouchableOpacity>
          {showGenres && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 10,
                }}>
                <CheckBox
                  center
                  title={'όλους'}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === 'όλους' ? true : false}
                  onPress={() => {
                    setGenre('όλους');
                  }}
                />
                <CheckBox
                  center
                  title={'άνδρες'}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === 'άνδρες' ? true : false}
                  onPress={() => {
                    setGenre('άνδρες');
                  }}
                />

                <CheckBox
                  center
                  title={'γυναίκες'}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === 'γυναίκες' ? true : false}
                  onPress={() => {
                    setGenre('γυναίκες');
                  }}
                />
              </View>
            </ScrollView>
          )}

          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              closeOtherFilters('age');
              setShowAge(!showAge);
            }}>
            <View style={[item, showAge && {marginBottom: 16}]}>
              <Text style={{fontSize: 15, color: 'black'}}>Εύρος ηλικίας</Text>
              <Text style={{fontSize: 20, color: 'black'}}>
                {age}-{highAge}
              </Text>
            </View>
            {showAge && (
              <Slider
                style={styles.slider}
                min={18}
                max={70}
                step={1}
                floatingLabel
                low={age}
                high={highAge}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={handleValueChange}
              />
            )}
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              closeOtherFilters('cost');
              setShowCost(!showCost);
            }}>
            <View style={[item, showCost && {marginBottom: 16}]}>
              <Text style={{fontSize: 15, color: 'black'}}>μέγιστο κόστος</Text>
              <Text style={{fontSize: 20, color: 'black'}}>{cost}€</Text>
            </View>
            {showCost && (
              <Slider
                disableRange={true}
                min={0}
                max={100}
                step={1}
                floatingLabel
                low={cost}
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
                renderLabel={renderLabel}
                renderNotch={renderNotch}
                onValueChanged={handleCostValueChange}
                onTouchStart={() => {
                  setAllowScroll(false);
                }}
                onTouchEnd={() => {
                  setAllowScroll(true);
                }}
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              allowPet == true
                ? setAllowPet(false)
                : allowPet == false
                ? setAllowPet(null)
                : setAllowPet(true);
            }}>
            <View style={item}>
              <Text style={{fontSize: 15, color: 'black'}}>
                δεκτα κατοικίδια
              </Text>

              {allowPet || allowPet === false ? (
                <LikeButton isLiked={allowPet} />
              ) : (
                <Text style={{fontSize: 20, color: 'black'}}>όλα</Text>
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              closeOtherFilters('dates');
              setShowDate(!showDate);
            }}
            style={{marginBottom: showDate ? 10 : 0}}>
            <View style={item}>
              <Text style={{fontSize: 15, color: 'black'}}>
                Επιλογή ημερομηνίας
              </Text>
            </View>
          </TouchableOpacity>
          {showDate && (
            <CustomRadioButton
              isFiltersScreen={true}
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
            />
          )}
          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              openPicker(3);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 'auto',
              marginTop: 16,
            }}>
            <Text style={{fontSize: 15, color: 'black'}}>
              Χρονολογία <Text style={{fontSize: 12}}>{'(>)'}</Text>
            </Text>
            <ViewRow>
              <Text style={{fontSize: 15, marginEnd: 10, color: 'black'}}>
                {carDate}
              </Text>
              <AntDesign
                name={'caretdown'}
                size={16}
                color={colors.colorPrimary}
              />
            </ViewRow>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              openPicker(2);
            }}
            style={item}>
            <Text style={{fontSize: 15, width: '50%', color: 'black'}}>
              μάρκα αυτοκινήτου
            </Text>
            <ViewRow>
              <Text style={{fontSize: 15, marginEnd: 10, color: 'black'}}>
                {carValue}
              </Text>

              <AntDesign
                name={'caretdown'}
                size={16}
                color={colors.colorPrimary}
              />
            </ViewRow>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: colors.CoolGray1,
              height: 1,
              marginTop: 5,
              marginBottom: 10,
              opacity: 0.4,
            }}
          />

          <RoundButton
            containerStyle={{marginVertical: 10}}
            text={'Αποθήκευση'}
            onPress={addToStorage}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </KeyboardAwareScrollView>
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
      <CalendarPickerModal
        isFiltersScreen={true}
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

      <DataSlotPickerModal
        data={pickerData}
        title={dataSlotPickerTitle}
        isVisible={dataSlotPickerVisible}
        onClose={() => {
          setDataSlotPickerVisible(false);
        }}
        onConfirm={(selectedValue, secValue, thirdValue) => {
          if (dataSlotPickerTitle === constVar.selectCar) {
            setCarValue(selectedValue);
          } else {
            setCarDate(selectedValue);
          }
          setDataSlotPickerVisible(false);
        }}
        initialValue1={getInitialValue()}
      />
    </BaseView>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'auto',
    marginTop: 16,
  },

  topLine: {
    marginTop: 16,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    backgroundColor: 'black',
    borderRadius: 26,
    height: 4,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '100%',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
