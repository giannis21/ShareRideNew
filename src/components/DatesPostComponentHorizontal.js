import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { CommonStyles } from '../layout/CommonStyles';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { CustomText } from './CustomText';
import { ViewRow } from './HOCS/ViewRow';

export function DatesPostComponentHorizontal({ item, style, size }) {
  var _ = require('lodash');
  const { titleStyle, justifyEvenly, row } = CommonStyles;

  const content = useSelector(state => state.contentReducer.content);


  const {
    textStyle,
    date,

    tillStyle
  } = styles;

  return (
    <View style={style}>



      <ViewRow style={{ marginStart: 0, justifyContent: item.post.withReturn ? 'space-around' : 'flex-start' }}>
        <View>
          <Text style={[textStyle, { marginBottom: 10 }]}>{content.depart}</Text>
          <View style={!item.post.withReturn ? row : null}>

            <Text style={date}>
              {item.post.startdate}
            </Text>

            {item.post.startdate !== item.post.enddate && (
              <View style={!item.post.withReturn ? row : null}>
                <Text
                  style={[tillStyle, item.post.withReturn ? { marginVertical: 3 } : null]}>
                  {content.till}
                </Text>

                <Text style={date}>
                  {item.post.enddate}
                </Text>
              </View>
            )}
          </View>

        </View>
        {item.post.withReturn && (
          <View style={{ marginStart: 15 }}>
            <Text style={[textStyle, { marginBottom: 10 }]}>{content.return}</Text>
            <View>
              <Text style={date}>
                {item.post.returnStartDate}
              </Text>

              {item.post.returnStartDate !== item.post.returnEndDate && (
                <View>
                  <Text
                    style={[tillStyle, item.post.withReturn ? { marginVertical: 3 } : null]}>
                    {content.till}
                  </Text>

                  <Text style={date}>
                    {item.post.returnEndDate}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}


      </ViewRow>


    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    color: 'white',
    paddingVertical: 2,
    width: 'auto',
    borderRadius: 7,
    overflow: 'hidden',
    fontSize: 11,
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: '#EE6C4D',
  },
  textStyle: {
    fontSize: 13,
    fontWeight: 'bold',

    color: 'black',
  },
  textStyle1: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingStart: 16,
    marginTop: 15,
    backgroundColor: colors.CoolGray2,
    paddingVertical: 1,
    color: 'black',
  },
  tillStyle: {
    fontSize: 12,
    color: '#595959',
    opacity: 0.6,
    marginHorizontal: 5,
    alignSelf: 'center'
  }
});
