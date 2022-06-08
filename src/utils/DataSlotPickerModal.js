import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';

import ScrollPicker from 'react-native-wheel-scrollview-picker';
var _ = require('lodash');

import { useDispatch, useSelector } from 'react-redux';
import { RoundButton } from '../Buttons/RoundButton';
import { TopContainerExtraFields } from '../components/TopContainerExtraFields';
import { colors } from './Colors';

export function DataSlotPickerModal({
  isVisible,
  onConfirm,
  onClose,
  title,
  data,
  secData,
  thirdData,
  initialValue1,
  initialValue2,
  initialValue3,
}) {
  const { modal, container, pickerContainer } = styles;
  const content = useSelector(state => state.contentReducer.content);

  let getInitialValue = num => {
    if (!data) return;
    switch (num) {
      case 1: {
        if (data.indexOf(initialValue1) >= 0) return initialValue1;
        else return data[0];
      }
      case 2: {
        if (secData.indexOf(initialValue2) >= 0) return initialValue2;
        else return secData[0];
      }
      default: {
        if (thirdData.indexOf(initialValue3) >= 0) return initialValue3;
        else return thirdData[0];
      }
    }
  };
  const [selectedValue, setSelectedValue] = useState(
    initialValue1 ? getInitialValue(1) : null,
  );

  const [secSelectedValue, setSecSelectedValue] = useState(
    initialValue2 ? getInitialValue(2) : null,
  );
  const [thirdSelectedValue, setThirdSelectedValue] = useState(
    initialValue3 ? getInitialValue(3) : null,
  );

  useEffect(() => {
    if (isVisible) {
      setSelectedValue(getInitialValue(1));
    }
  }, [isVisible]);

  let renderNewPicker = (data, num) => {
    let selectedIndex = _.indexOf(data, getInitialValue(num));

    return (
      <ScrollPicker
        useNativeDriver={true}
        dataSource={data}
        selectedIndex={selectedIndex}
        renderItem={(item, index, isSelected) => {
          return (
            <Text
              style={
                isSelected
                  ? [styles.itemText, styles.itemTextSelected]
                  : styles.itemText
              }>
              {item}
            </Text>
          );
        }}
        onValueChange={value => {
          if (num === 1) {
            setSelectedValue(value);
          } else if (num === 2) {
            setSecSelectedValue(value);
          } else {
            setThirdSelectedValue(value);
          }
        }}
        wrapperHeight={200}
        itemHeight={40}
        highlightColor={'white'}
      />
    );
  };
  return (
    <Modal
      useNativeDriver={true}
      isVisible={isVisible}
      style={modal}
      onSwipeCancel={onClose}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      propagateSwipe={false}>
      <View style={container}>
        <TopContainerExtraFields
          onCloseContainer={onClose}
          title={title}
          addMarginStart
        />
        <View style={pickerContainer}>
          {renderNewPicker(data, 1)}
          {secData && renderNewPicker(secData, 2)}
          {thirdData && renderNewPicker(thirdData, 3)}
        </View>
        <RoundButton
          containerStyle={{ bottom: 10, marginHorizontal: 10 }}
          text={content.go}
          onPress={() => {
            onConfirm(selectedValue, secSelectedValue, thirdSelectedValue);
          }}
          backgroundColor={colors.colorPrimary}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  container: {
    backgroundColor: 'white',
    borderTopEndRadius: 24,
    borderTopLeftRadius: 24,
  },

  filterButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 100,
  },

  select: {
    marginTop: 72,
    marginBottom: 32,

    backgroundColor: 'black',
  },
  itemTextSelected: {
    color: 'black',
  },

  itemText: {
    color: '#9A9A9A',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
  },
});
