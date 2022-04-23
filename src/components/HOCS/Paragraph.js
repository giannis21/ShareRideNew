import React from 'react';
import {Text} from 'react-native';

export function Paragraph({
  paddingLeft,
  paddingRight,
  marginTop,
  marginStart,
  marginBottom,
  marginHorizontal,
  textAlign,
  children,
  color,
  containerStyle,
}) {
  let subtitle = [
    paddingLeft ? {paddingLeft} : '',
    paddingRight ? {paddingRight} : '',
    marginTop ? {marginTop} : '',
    marginBottom ? {marginBottom} : '',
    textAlign ? {textAlign} : '',
    color ? {color} : '',
    marginStart ? {marginStart} : '',
    marginHorizontal ? {marginHorizontal} : '',
  ];

  return <Text style={[subtitle, containerStyle]}>{children}</Text>;
}
