import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { CommonStyles } from '../layout/CommonStyles';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { CustomIcon } from './CustomIcon';
import { ViewRow } from './HOCS/ViewRow';
import { MiddleStopsComponent } from './MiddleStopsComponent';

export function DestinationsComponentHorizontal({
  moreplaces,
  startplace,
  endplace,
  containerStyle,
}) {
  var _ = require('lodash');
  const [array, setArray] = useState([]);
  const { titleStyle, justifyBetween } = CommonStyles;

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
    <View style={[containerStyle, { height: 'auto' }]}>

      <ViewRow style={justifyBetween} >
        <View>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>
            {startplace}
          </Text>
          <Entypo name="location-pin" size={20} style={{ opacity: 0.4 }} color={'black'} />

        </View>

        <View>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>
            {endplace}
          </Text>
          <ViewRow style={{ alignSelf: 'flex-end' }}>
            <CustomIcon
              name="caretright"
              type="AntDesign"
              size={15}
              color={colors.CoolGray1}
              style={{ transform: [{ translateX: 6.5 }, { translateY: 5 }] }}
            />
            <Entypo name="location-pin" size={20} style={{ opacity: 0.4 }} color={'black'} />

          </ViewRow>
        </View>
      </ViewRow>
      <View style={locationsLine} />


      {moreplaces && moreplaces.length > 0 ? (
        <MiddleStopsComponent moreplaces={moreplaces} />
      ) : (
        <Spacer height={12} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  locationsLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.CoolGray1,
    height: 1,
    marginHorizontal: 13,
    marginVertical: 30,
    zIndex: -11
  },

});
