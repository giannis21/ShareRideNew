import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spacer } from '../layout/Spacer';
import { ViewRow } from './HOCS/ViewRow';

export function MiddleStopsComponent({ moreplaces }) {
  var _ = require('lodash');
  const [array, setArray] = useState([]);

  useEffect(() => {
    if (typeof moreplaces === 'string') {
      setArray([...Array.from(JSON.parse(moreplaces))]);
    } else {
      setArray(moreplaces);
    }
  }, []);

  const { container } = styles;
  return (
    <ViewRow style={{ justifyContent: 'space-around', transform: [{ translateY: -12 }] }}>
      {array.map((item1, index) => {
        return (
          <View >
            <View style={styles.circle} />
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>
              {item1?.place}
            </Text>
            <Spacer height={3} />
          </View>
        );
      })}
    </ViewRow>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 20,

    backgroundColor: colors.CoolGray1,
    width: 10,
    height: 10,
    overflow: 'hidden',
    zIndex: 1
  },
  container: {
    marginStart: 16,
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
});
