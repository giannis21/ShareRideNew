import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {CustomInput} from './CustomInput';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {Spacer} from '../layout/Spacer';
import {CloseIconComponent} from '../components/CloseIconComponent';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {constVar} from './constStr';
import {CheckBox} from 'react-native-elements';
import Slider from 'rn-range-slider';
import Thumb from '../components/rangePicker/Thumb';
import Rail from '../components/rangePicker/Rail';
import RailSelected from '../components/rangePicker/RailSelected';
import Label from '../components/rangePicker/Label';
import Notch from '../components/rangePicker/Notch';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//import DropDownPicker from 'react-native-dropdown-picker';
import {carBrands} from '../utils/Functions';
import {filterKeys, getValue, setValue} from './Storage';
export function FiltersModal({
  closeAction,
  title,
  titleType,
  description,
  buttonText,
  closeText,
  buttonPress,
  isVisible,
  descrStyle,
  onChangeText,
}) {
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(value => <Label text={value} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [carDate, setCarDate] = useState('');
  const [cost, setCost] = useState(0);
  const [open, setOpen] = useState(false);
  const [carValue, setCarValue] = useState('ΟΛΑ');
  const [items, setItems] = useState(carBrands);
  const [age, setAge] = useState(18);
  const [highAge, setHighAge] = useState(70);
  const [genre, setGenre] = useState(null);
  const [showGenres, setShowGenres] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [allowScroll, setAllowScroll] = useState(true);
  const [allowPet, setAllowPet] = useState(false);

  //   useEffect(() => {
  //     setTimeout(() => {
  //       if (!isVisible) {
  //         // setCarValue(null)
  //         // setGenre('όλους')
  //         // setCost(0)
  //       }
  //     }, 1000);
  //   }, [isVisible]);

  useEffect(async () => {
    if (!isVisible) return;

    resetValues();
  }, [isVisible]);

  const handleValueChange = useCallback((low, high) => {
    setAge(low);
    setHighAge(high);
  }, []);

  const handleCostValueChange = useCallback((low, high) => {
    setCost(low);
  }, []);

  const {modal, container, item} = styles;

  let getGenreValue = () => {
    if (genre === 'όλους') return 'όλους';

    if (genre === 'άνδρες') return 'άνδρες';

    if (genre === 'γυναίκες') return 'γυναίκες';

    return '';
  };
  const addToStorage = async () => {
    try {
      await setValue('showMe', genre);
      await setValue(filterKeys.ageRange, age + '-' + highAge);
      await setValue(filterKeys.maxCost, cost.toString());
      await setValue(filterKeys.carMark, carValue.toString());
      await setValue(filterKeys.carAge, carDate.toString());
      closeAction();
    } catch (err) {
      console.log({err});
    }
  };

  const resetValues = async () => {
    setCarValue((await getValue(filterKeys.carMark)) ?? 'ΟΛΑ');
    setGenre((await getValue(filterKeys.showMe)) ?? 'όλους');
    setCost((await getValue(filterKeys.maxCost)) ?? '0');
    let ageRange = await getValue(filterKeys.ageRange);
    if (ageRange) {
      setAge(ageRange.split('-')[0]);
      setHighAge(ageRange.split('-')[1]);
    } else {
      setAge('18');
      setHighAge('70');
    }
    setCarDate((await getValue(filterKeys.carAge)) ?? '');
  };

  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={modal}
        onBackdropPress={closeAction}
        onSwipeComplete={closeAction}
        swipeDirection="down"
        useNativeDriver={true}>
        <KeyboardAwareScrollView
          extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={true}
          bounces={true}
          keyboardShouldPersistTaps={'handled'}
          scrollEnabled={allowScroll}
          style={container}>
          <View style={[item, {marginHorizontal: 16}]}>
            <CloseIconComponent onPress={closeAction} />
            <Text style={{fontSize: 20, marginStart: 16, fontWeight: 'bold'}}>
              Φίλτρα αναζήτησης
            </Text>
            <TouchableOpacity onPress={resetValues}>
              <Text style={{fontSize: 15, marginStart: 16}}>reset</Text>
            </TouchableOpacity>
          </View>

          <View marginHorizontal={16}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setShowGenres(!showGenres);
              }}
              style={item}>
              <Text style={{fontSize: 15}}>Δείξε μου</Text>
              <Text style={{fontSize: 20}}>{genre}</Text>
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
                setShowAge(!showAge);
              }}>
              <View style={[item, showAge && {marginBottom: 16}]}>
                <Text style={{fontSize: 15}}>Εύρος ηλικίας</Text>
                <Text style={{fontSize: 20}}>
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
                marginTop: 15,
                marginBottom: 10,
                opacity: 0.4,
              }}
            />
            <TouchableOpacity
              style={{marginBottom: 10}}
              activeOpacity={1}
              onPress={() => {
                setShowCost(!showCost);
              }}>
              <View style={[item, showCost && {marginBottom: 16}]}>
                <Text style={{fontSize: 15}}>μέγιστο κόστος</Text>
                <Text style={{fontSize: 20}}>{cost}€</Text>
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
                marginTop: 15,
                marginBottom: 10,
                opacity: 0.4,
              }}
            />
            <TouchableOpacity
              style={{marginBottom: 10}}
              activeOpacity={1}
              onPress={() => {
                setAllowPet(!allowPet);
              }}>
              <View style={[item, showCost && {marginBottom: 16}]}>
                <Text style={{fontSize: 15}}>δεκτα κατοικίδια</Text>
                <Text style={{fontSize: 20}}>{allowPet ? '👍' : '👎'}</Text>
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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 'auto',
                marginTop: 16,
              }}>
              <Text style={{fontSize: 15}}>
                Χρονολογια <Text style={{fontSize: 12}}>{'(>)'}</Text>
              </Text>
              <TextInput
                style={{fontSize: 20}}
                maxLength={4}
                placeholder={'ex 2018'}
                value={carDate}
                keyboardType="numeric"
                onChangeText={val => {
                  setCarDate(val);
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: colors.CoolGray1,
                height: 1,
                marginTop: 5,
                marginBottom: 10,
                opacity: 0.4,
              }}
            />
            <View style={[item, {marginBottom: 16}]}>
              <Text style={{fontSize: 15, width: '50%'}}>
                μάρκα αυτοκινήτου
              </Text>
            </View>
            <View style={open ? {height: 244} : {height: 44}}>
              {/* <DropDownPicker
                onOpen={() => setAllowScroll(false)}
                onClose={() => setAllowScroll(true)}
                containerStyle={{height: 'auto'}}
                zIndex={3000}
                zIndexInverse={1000}
                open={open}
                value={carValue}
                items={items}
                setOpen={setOpen}
                setValue={val => setCarValue(val)}
                setItems={setItems}
              /> */}
            </View>

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
              text={'Αποθήκευση'}
              onPress={addToStorage}
              backgroundColor={colors.colorPrimary}
            />
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
}

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
  },
  descriptionStyle: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    textAlign: 'center',
  },
});
