import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { HorizontalLine } from './HorizontalLine';

export function SelectLocationComponent({
  titleStart,
  titleEnd,
  isPostScreen,
  startingPointPress,
  endPointPress,
  onReset,
  containerStyle,
}) {
  const post = useSelector(state => state.postReducer);
  const content = useSelector(state => state.contentReducer.content);


  const getInitText = () => {
    let text = '';
    if (isPostScreen) {
      text = post.startplace === '' ? titleStart : post.startplace;
    } else {
      text = post.searchStartplace === '' ? titleStart : post.searchStartplace;
    }
    return text;
  };

  const getFinalText = () => {
    let text = '';
    if (isPostScreen) {
      text = post.endplace === '' ? titleEnd : post.endplace;
    } else {
      text = post.searchEndplace === '' ? titleEnd : post.searchEndplace;
    }
    return text;
  };

  const getInitColor = () => {
    if (isPostScreen) {
      return post.startplace === '' ? '#8b9cb5' : 'black';
    } else {
      return post.searchStartplace === '' ? '#8b9cb5' : 'black';
    }
  };

  const getFinalColor = () => {
    if (isPostScreen) {
      return post.endplace === '' ? '#8b9cb5' : 'black';
    } else {
      return post.searchEndplace === '' ? '#8b9cb5' : 'black';
    }
  };
  function LocationInput({ isStarting }) {
    return (
      <TouchableOpacity
        onPress={() => {
          isStarting ? startingPointPress() : endPointPress();
        }}>
        <Spacer height={20} />
        <Text style={{ color: isStarting ? getInitColor() : getFinalColor() }}>
          {isStarting ? getInitText() : getFinalText()}
        </Text>
        <Spacer height={15} />
        <HorizontalLine
          containerStyle={{ backgroundColor: colors.colorPrimary }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={{ color: 'black', fontWeight: 'bold' }}>{content.From}</Text>

        <Text onPress={onReset} style={{ color: 'black' }}>
          {isPostScreen ? 'reset all' : 'reset'}
        </Text>
      </View>

      <LocationInput isStarting={true} />
      <Spacer height={35} />

      <Text style={{ color: 'black', fontWeight: 'bold' }}>{content.To}</Text>
      <LocationInput isStarting={false} />
    </View>
  );
}
