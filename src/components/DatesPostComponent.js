import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import { CommonStyles } from '../layout/CommonStyles';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { CustomText } from './CustomText';
import { ViewRow } from './HOCS/ViewRow';

export function DatesPostComponent({ item, style, size }) {
  var _ = require('lodash');
  const { titleStyle } = CommonStyles;

  const content = useSelector(state => state.contentReducer.content);


  const {
    textStyle,
    textStyle1,
    date,
    date1,
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
    <View style={style}>
      {size === 'big' ? (
        <View style={[titleStyle, { marginTop: 15, marginBottom: 10 }]}>
          <CustomText type={'title1'} text={content.depart} />
        </View>
      ) : (
        <Text style={textStyle}>{content.depart}</Text>
      )}
      <ViewRow
        style={
          size === 'big'
            ? { marginStart: 16, marginTop: 10 }
            : { justifyContent: 'center', alignItems: 'center', marginTop: 10 }
        }>
        <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>
          {item.post.startdate}
        </Text>

        {item.post.startdate !== item.post.enddate && (
          <ViewRow style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 12,
                color: '#595959',
                opacity: 0.6,
                marginHorizontal: 5,
              }}>
              {content.till}
            </Text>

            <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>
              {item.post.enddate}
            </Text>
          </ViewRow>
        )}
      </ViewRow>

      {item.post.withReturn === true && (
        <View>
          {size === 'big' ? (
            <View style={[titleStyle, { marginTop: 23, marginBottom: 10 }]}>
              <CustomText type={'title1'} text={content.return} />
            </View>
          ) : (
            <Text style={[textStyle, { marginTop: 10 }]}>{content.return}</Text>
          )}

          <View
            style={
              size === 'big'
                ? { marginStart: 16 }
                : { justifyContent: 'center', alignItems: 'center' }
            }>
            <ViewRow style={{ marginTop: 10 }}>
              <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>
                {item.post.returnStartDate}
              </Text>

              {item.post.returnStartDate !== item.post.returnEndDate && (
                <ViewRow style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#595959',
                      opacity: 0.6,

                      marginHorizontal: 5,
                    }}>
                    {content.till}
                  </Text>

                  <Text
                    style={[
                      date,
                      {
                        fontSize: size === 'big' ? 15 : 10,
                      },
                    ]}>
                    {item.post.returnEndDate}
                  </Text>
                </ViewRow>
              )}
            </ViewRow>
          </View>
        </View>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: colors.colorPrimary,
  },
  textStyle: {
    fontSize: 13,
    fontWeight: 'bold',
    alignSelf: 'center',
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
});
