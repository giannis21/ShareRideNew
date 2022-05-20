import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {colors} from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {Spacer} from '../layout/Spacer';
import {constVar} from '../utils/constStr';
import {useSelector, useDispatch} from 'react-redux';
import {
  REMOVE_DATES,
  REMOVE_DATES_FILTERS,
  SET_TOOLTIP_VISIBLE,
} from '../actions/types';

import {CustomIcon} from './CustomIcon';
import {CustomText} from './CustomText';
import Tooltip from './tooltip/Tooltip';
import {LikeButton} from './LikeButton';
import {CommonStyles} from '../layout/CommonStyles';
import {ViewRow} from './HOCS/ViewRow';
import {
  removeDateFilters,
  removeDates,
  setToolTipVisible,
} from '../actions/actions';

export function CustomRadioButton({
  isFiltersScreen,
  onPress,
  selectedOption,
  rangeRadioSelected,
  returnedDate,
  onIconPress,
}) {
  const [selected, setSelected] = useState('many');
  const [hasReturnDate, setHasReturnDate] = useState(false);

  let dispatch = useDispatch();
  const post = useSelector(state => state.postReducer);
  const filtersReducer = useSelector(state => state.filtersReducer);
  const generalReducer = useSelector(state => state.generalReducer);
  let tooltipRef = useRef();

  let opacityRight = selected === 'one' ? 0.2 : null;

  const {width} = Dimensions.get('window');
  const {titleStyle} = CommonStyles;

  const toggleTooltip = (delay = 0) => {
    setTimeout(() => {
      tooltipRef.current.toggleTooltip();
    }, delay);
  };

  const clearDates = () => {
    isFiltersScreen ? dispatch(removeDateFilters()) : dispatch(removeDates());
  };

  const setSelectedDate = dateIndicator => {
    selectedOption(dateIndicator);
  };

  const resetIcon = () => {
    if (isFiltersScreen) {
      if (
        filtersReducer.startdate !== constVar.initialDate ||
        filtersReducer.enddate !== constVar.endDate ||
        filtersReducer.returnStartDate !== constVar.returnStartDate ||
        filtersReducer.returnEndDate !== constVar.returnEndDate
      )
        return true;

      return false;
    }

    if (
      post.startdate !== constVar.initialDate ||
      post.enddate !== constVar.endDate ||
      post.returnStartDate !== constVar.returnStartDate ||
      post.returnEndDate !== constVar.returnEndDate
    )
      return true;

    return false;
  };
  const DateInput = ({date, selection, opacity, disabled}) => {
    return (
      <TouchableOpacity
        disabled={disabled || generalReducer.isToolTipVisible}
        style={{width: '48%'}}
        onPress={() => {
          setSelectedDate(selection);
        }}>
        <Spacer height={20} />
        <Text
          style={{color: getColor(selection), alignSelf: 'center', opacity}}>
          {date}
        </Text>
        <Spacer height={10} />
        <View
          style={{
            width: '100%',
            backgroundColor: colors.colorPrimary,
            height: 1,
            opacity,
          }}
        />
      </TouchableOpacity>
    );
  };

  const getColor = option => {
    switch (option) {
      case 0:
        return getStartDate() === constVar.initialDate ? '#8b9cb5' : 'black';
      case 1:
        return getEndDate() === constVar.endDate ? '#8b9cb5' : 'black';
      case 2:
        return getReturnStartDate() === constVar.returnStartDate
          ? '#8b9cb5'
          : 'black';
      case 3:
        return getReturnEndDate() === constVar.returnEndDate
          ? '#8b9cb5'
          : 'black';
    }
  };
  const getEndDate = () => {
    return isFiltersScreen ? filtersReducer.enddate : post.enddate;
  };

  const getStartDate = () => {
    return isFiltersScreen ? filtersReducer.startdate : post.startdate;
  };

  const getReturnStartDate = () => {
    return isFiltersScreen
      ? filtersReducer.returnStartDate
      : post.returnStartDate;
  };
  const getReturnEndDate = () => {
    return isFiltersScreen ? filtersReducer.returnEndDate : post.returnEndDate;
  };
  const setToolTipVisible1 = isVisible => {
    dispatch(setToolTipVisible(isVisible));
  };

  const [isSafeClick, setSafeClick] = useState(true);

  const safeClickListener = callback => {
    setSafeClick(false);
    setTimeout(function () {
      setSafeClick(true);
    }, 2000);
  };

  return (
    <View onPress={onPress} style={styles.container}>
      <Tooltip
        disabled={true}
        ref={tooltipRef}
        height={104}
        width={width / 1.2}
        skipAndroidStatusBar={true}
        backgroundColor={colors.colorPrimary}
        withOverlay={true}
        pointerColor={colors.colorPrimary}
        toggleOnPress={false}
        trianglePosition="middle"
        isTooltipVisible={setToolTipVisible1}
        popover={
          <Text style={{color: 'white'}}>
            {isFiltersScreen
              ? constVar.datesTooltipFilters
              : constVar.datesTooltip}
          </Text>
        }>
        <View>
          <View
            style={[
              titleStyle,
              isFiltersScreen
                ? {
                    backgroundColor: 'transparent',
                    transform: [{translateX: -10}],
                  }
                : null,
            ]}>
            <CustomText
              style={{
                marginBottom: 15,
                marginTop: 25,
              }}
              type={'title1'}
              text={'Αναχώρηση - Επιστροφή'}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              marginStart: 10,
              marginTop: 5,
              position: 'absolute',
            }}>
            <CustomIcon
              onPress={() => {
                if (isSafeClick) {
                  onIconPress && onIconPress();
                  setTimeout(() => {
                    toggleTooltip();
                  }, 500);
                  safeClickListener();
                }
              }}
              name="info"
              type="Feather"
              size={20}
              color={colors.Gray3}
            />
          </TouchableOpacity>

          {resetIcon() && (
            <TouchableOpacity
              onPress={clearDates}
              style={{alignItems: 'flex-end', marginTop: 10, marginEnd: 16}}>
              <Icon name="close" color="black" size={18} />
            </TouchableOpacity>
          )}

          <Spacer height={10} />

          <View style={{flexDirection: 'row', marginHorizontal: 16}}>
            <DateInput date={getStartDate()} selection={0} />

            <View style={{width: '4%'}} />

            <DateInput
              date={getEndDate()}
              selection={1}
              opacity={opacityRight}
              disabled={selected === 'one'}
            />
          </View>
        </View>
      </Tooltip>
      <TouchableWithoutFeedback
        onPress={() => {
          returnedDate(!hasReturnDate);
          setHasReturnDate(!hasReturnDate);
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 13,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: '#8b9cb5',
            marginEnd: 5,
            textDecorationLine: 'underline',
          }}>
          με επιστροφη;
        </Text>
        <LikeButton isLiked={hasReturnDate} />
      </TouchableWithoutFeedback>

      {hasReturnDate && (
        <View style={{marginTop: 15, marginHorizontal: 16}}>
          <Text style={{color: '#8b9cb5'}}>Σκέφτομαι να επιστρέψω..</Text>

          <ViewRow>
            <DateInput date={getReturnStartDate()} selection={2} />
            <View style={{width: '4%'}} />
            <DateInput date={getReturnEndDate()} selection={3} />
          </ViewRow>

          <Text style={{color: '#8b9cb5', fontSize: 10, marginTop: 4}}>
            *μπορείς να επιλέξεις μία,δύο ή καμία
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  unSelectedText: {
    color: 'black',
  },
  selectedText: {
    color: 'white',
  },
  rightContainer: {
    borderTopRightRadius: 14,
    borderBottomEndRadius: 14,
    width: '50%',
    paddingVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.colorPrimary,
    borderWidth: 1,
  },
  leftContainer: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    width: '50%',
    paddingVertical: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorPrimary,
    borderColor: colors.colorPrimary,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    marginTop: 5,
    margin: 0,
  },
});
