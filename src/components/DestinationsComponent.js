import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {Spacer} from '../layout/Spacer';
import {colors} from '../utils/Colors';
import {ViewRow} from './HOCS/ViewRow';
import {MiddleStopsComponent} from './MiddleStopsComponent';

export function DestinationsComponent({
  moreplaces,
  startplace,
  endplace,
  containerStyle,
}) {
  var _ = require('lodash');
  const [array, setArray] = useState([]);

  useEffect(() => {
    if (!moreplaces) {
      return;
    }
    if (typeof moreplaces === 'string') {
      setArray([...Array.from(JSON.parse(moreplaces))]);
    } else {
      setArray(moreplaces);
    }
  }, []);

  const {
    addMoreUsers,
    userStyleAdded,
    userStyle,
    leftContainer,
    rightContainer,
    container,
    rightContainerView,
    locationsLine,
    heartContainer,
    bottomContainer,
    seats,
  } = styles;

  return (
    <View style={[containerStyle, {height: 'auto'}]}>
      <View style={locationsLine} />
      <ViewRow>
        <Entypo name="location-pin" size={20} color={colors.colorPrimary} />
        <Text style={{fontSize: 13, fontWeight: 'bold', color: 'black'}}>
          {startplace}
        </Text>
      </ViewRow>

      {moreplaces && moreplaces.length > 0 ? (
        <MiddleStopsComponent moreplaces={moreplaces} />
      ) : (
        <Spacer height={12} />
      )}

      <ViewRow>
        <Entypo name="location-pin" size={20} color={colors.colorPrimary} />
        <Text style={{fontSize: 13, fontWeight: 'bold', color: 'black'}}>
          {endplace}
        </Text>
      </ViewRow>
    </View>
  );
}

const styles = StyleSheet.create({
  locationsLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 9,
    right: 0,
    backgroundColor: colors.CoolGray1.toString(),
    width: 1,
    marginVertical: 15,
  },
});
