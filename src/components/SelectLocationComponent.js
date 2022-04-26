import React, {useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import {Spacer} from '../layout/Spacer';
import {colors} from '../utils/Colors';

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
    let color = '';
    if (isPostScreen) {
      color = post.startplace === '' ? '#8b9cb5' : 'black';
    } else {
      color = post.searchStartplace === '' ? '#8b9cb5' : 'black';
    }
    return color;
  };

  const getFinalColor = () => {
    let color = '';
    if (isPostScreen) {
      color = post.endplace === '' ? '#8b9cb5' : 'black';
    } else {
      color = post.searchEndplace === '' ? '#8b9cb5' : 'black';
    }
    return color;
  };
  return (
    <View style={containerStyle}>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Από</Text>
        <TouchableOpacity onPress={onReset}>
          <Text style={{color: 'black'}}>
            {isPostScreen ? 'reset all' : 'reset'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={startingPointPress}>
        <Spacer height={20} />
        <Text style={{color: getInitColor()}}>{getInitText()}</Text>
        <Spacer height={15} />
        <View
          style={{
            width: '100%',
            backgroundColor: colors.colorPrimary,
            height: 1,
          }}
        />
      </TouchableOpacity>

      <Spacer height={35} />
      <Text style={{color: 'black', fontWeight: 'bold'}}>Μέχρι</Text>
      <TouchableOpacity onPress={endPointPress}>
        <Spacer height={20} />
        <Text style={{color: getFinalColor()}}>{getFinalText()}</Text>
        <Spacer height={15} />
        <View
          style={{
            width: '100%',
            backgroundColor: colors.colorPrimary,
            height: 1,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
