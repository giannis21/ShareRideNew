import React, { useState, useEffect, useCallback } from 'react';
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
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CloseIconComponent } from '../../components/CloseIconComponent';
import Slider from 'rn-range-slider';
import Thumb from '../../components/rangePicker/Thumb';
import Rail from '../../components/rangePicker/Rail';
import RailSelected from '../../components/rangePicker/RailSelected';
import Label from '../../components/rangePicker/Label';
import Notch from '../../components/rangePicker/Notch';
import { carBrands, GENRE, getGenreFromDb, newCarBrands, range, showToast } from '../../utils/Functions';
import { colors } from '../../utils/Colors';

import { RoundButton } from '../../Buttons/RoundButton';
import { CustomRadioButton } from '../../components/CustomRadioButton';
import { useIsFocused } from '@react-navigation/native';
import { filterKeys, getValue, setValue } from '../../utils/Storage';
import { CalendarPickerModal } from '../../utils/CalendarPickerModal';
import {
  ADD_DATES_FILTERS,
  SET_RADIO_SELECTED_FILTERS,
} from '../../actions/types';
import { useSelector, useDispatch } from 'react-redux';
import { constVar } from '../../utils/constStr';
import { DataSlotPickerModal } from '../../utils/DataSlotPickerModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { ViewRow } from '../../components/HOCS/ViewRow';
import { BaseView } from '../../layout/BaseView';
import { LikeButton } from '../../components/LikeButton';
import { CustomText } from '../../components/CustomText';
import { regex } from '../../utils/Regex';

const FiltersScreen = ({ navigation, route }) => {
  var _ = require('lodash');

  const content = useSelector(state => state.contentReducer.content);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [carDate, setCarDate] = useState('2000');
  const [cost, setCost] = useState(0);
  const [open, setOpen] = useState(false);
  const [carValue, setCarValue] = useState(content.all1)
  const [items, setItems] = useState(carBrands);
  const [age, setAge] = useState(18);
  const [highAge, setHighAge] = useState(70);
  const [genre, setGenre] = useState('');
  const [showGenres, setShowGenres] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [allowScroll, setAllowScroll] = useState(true);
  const [allowPet, setAllowPet] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [hasReturnDate, setHasReturnDate] = useState(false);
  const [rangeDate, setRangeDate] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerData, setPickerData] = useState([]);
  const [dataSlotPickerVisible, setDataSlotPickerVisible] = useState(false);
  const [dataSlotPickerTitle, setDataSlotPickerTitle] = useState(
    content.selectAge,
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
      setDataSlotPickerTitle(content.selectAge);
      setDataSlotPickerVisible(true);
    } else if (option === 2) {
      setPickerData([content.all1].concat(newCarBrands).slice(0, -1));
      setDataSlotPickerTitle(content.selectCar);
      setDataSlotPickerVisible(true);
    } else {
      setPickerData(range(2000, parseInt(moment().format('YYYY'))));
      setDataSlotPickerTitle(content.selectCarAge);
      setDataSlotPickerVisible(true);
    }
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

  const genreToSave = (genre) => {
    switch (genre) {
      case content.all: return GENRE.ALL
      case content.men: return GENRE.MEN
      default: return GENRE.WOMEN
    }
  }

  const addToStorage = async () => {
    if (
      regex.date.test(filtersReducer?.returnStartDate) ||
      regex.date.test(filtersReducer?.startdate) ||
      regex.date.test(filtersReducer?.enddate) ||
      regex.date.test(filtersReducer?.returnEndDate)) {

      if (
        !regex.date.test(filtersReducer?.returnStartDate) &&
        regex.date.test(filtersReducer?.returnEndDate)
      ) {
        showToast(content.selectInitialReturningDate, false)
        return;
      }

      if (!regex.date.test(filtersReducer?.startdate)) {
        showToast(content.mustChooseInitialDepartDate, false)
        return;
      }
    }

    try {
      await setValue(filterKeys.showMe, genreToSave(genre));
      await setValue(filterKeys.ageRange, age + '-' + highAge);
      await setValue(filterKeys.maxCost, cost.toString());
      await setValue(filterKeys.carMark, carValue.toString());
      await setValue(filterKeys.carAge, carDate.toString());
      await setValue(
        filterKeys.allowPet,
        allowPet?.toString() === 'true'
          ? 'true'
          : allowPet?.toString() === 'false'
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
      console.log({ err });
    }
  };

  const getGenre = (genre) => {
    switch (genre) {
      case GENRE.ALL: return content.all
      case GENRE.MEN: return content.men
      default: return content.women
    }
  }
  const getcarBrand = (car) => {
    if (car === "??????" || car === 'ALL' || car === "All" || !car) {
      return content.all1
    }
    return car
  }


  const resetValues = async () => {
    let allowPetVar =
      (await getValue(filterKeys.allowPet)) === 'true'
        ? true
        : (await getValue(filterKeys.allowPet)) === 'false'
          ? false
          : null;
    setCarValue(getcarBrand(await getValue(filterKeys.carMark)));
    setGenre(getGenre((await getValue(filterKeys.showMe))));
    setCost((await getValue(filterKeys.maxCost)) ?? '100');

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
        (await getValue(filterKeys.startDate)) ?? content.initialDate,
        (await getValue(filterKeys.endDate)) ?? content.endDate,
        (await getValue(filterKeys.returnStartDate)) ?? content.returnStartDate,
        (await getValue(filterKeys.returnEndDate)) ?? content.returnEndDate,
      ],
    });
  };

  const { container, item } = styles;
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
        <View style={[item, { marginHorizontal: 16 }]}>
          <ViewRow>
            <CloseIconComponent onPress={goBack} />
            <CustomText
              type={'header'}
              containerStyle={{ marginStart: 14 }}
              text={content.filtersTitle}
            />
          </ViewRow>


          <TouchableOpacity onPress={resetValues}>
            <CustomText type={'filtersBold'} text={'reset'} />
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
            <CustomText type={'filtersBold'} text={content.showMe} />

            <Text style={{ fontSize: 15, color: 'black' }}>{genre}</Text>
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
                  title={content.all}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === content.all ? true : false}
                  onPress={() => {
                    setGenre(content.all);
                  }}
                />
                <CheckBox
                  center
                  title={content.men}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === content.men ? true : false}
                  onPress={() => {
                    setGenre(content.men);
                  }}
                />

                <CheckBox
                  center
                  title={content.women}
                  checkedIcon="check-square-o"
                  uncheckedIcon="square-o"
                  checked={genre === content.women ? true : false}
                  onPress={() => {
                    setGenre(content.women);
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
            <View style={[item, showAge && { marginBottom: 16 }]}>
              <CustomText type={'filtersBold'} text={content.ageRange} />
              <Text style={{ fontSize: 15, color: 'black' }}>
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



            <View style={[item, showCost && { marginBottom: 16 }]}>
              <CustomText type={'filtersBold'} text={content.maxCost} />
              <Text style={{ fontSize: 15, color: 'black' }}>{cost}???</Text>
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
              <CustomText type={'filtersBold'} text={content.petAllowed} />

              {allowPet || allowPet === false ? (
                <LikeButton isLiked={allowPet} />
              ) : (
                <Text style={{ fontSize: 15, color: 'black' }}>{content.all2}</Text>
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
            style={{ marginBottom: showDate ? 10 : 0 }}>
            <View style={item}>
              <CustomText type={'filtersBold'} text={content.chooseDate} />
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
            <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>
              {content.age} <Text style={{ fontSize: 12 }}>{'(>)'}</Text>
            </Text>
            <ViewRow>
              <Text style={{ fontSize: 15, marginEnd: 10, color: 'black' }}>
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
            <Text style={{ fontSize: 18, width: '50%', color: 'black', fontWeight: 'bold' }}>
              {content.carBrandTitle}
            </Text>
            <ViewRow>
              <Text style={{ fontSize: 15, marginEnd: 10, color: 'black' }}>
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
            containerStyle={{ marginVertical: 10, bottom: 0 }}
            text={content.save}
            onPress={addToStorage}
            backgroundColor={colors.colorPrimary}
          />
        </View>
      </KeyboardAwareScrollView>

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
          if (dataSlotPickerTitle === content.selectCar) {
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
