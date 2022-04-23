import React from 'react';
import {View, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';

export function CustomIcon({name, style, size, color, type, onPress}) {
  const generalReducer = useSelector(state => state.generalReducer);

  return (
    <TouchableOpacity
      disabled={generalReducer.isToolTipVisible}
      onPress={() => onPress && onPress()}
      style={style}>
      {type === 'AntDesign' && (
        <AntDesign name={name} size={size} color={color} />
      )}
      {type === 'Feather' && <Feather name={name} size={size} color={color} />}
      {type === 'Ionicons' && (
        <Ionicons name={name} size={size} color={color} />
      )}
      {type === 'Fontisto' && (
        <Fontisto name={name} size={size} color={color} />
      )}
      {type === 'Entypo' && <Entypo name={name} size={size} color={color} />}
      {type === 'EvilIcons' && (
        <EvilIcons name={name} size={size} color={color} />
      )}
      {type === 'MaterialIcons' && (
        <MaterialIcons name={name} size={size} color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
