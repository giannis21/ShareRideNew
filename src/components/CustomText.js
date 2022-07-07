import React from 'react';
import { Text } from 'react-native';

export function CustomText({
  text,
  type,
  color,
  textAlign,
  onPress,
  underline,
  onWidth,
  loading,
  line,
  skeletonWidth,
  containerStyle,
  textStyle,
}) {
  let getStyleForText = type => {
    switch (type) {
      case 'title0':
        return {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
        };
      case "filtersBold": {
        return {
          fontSize: 18,
          color: 'black',
          fontWeight: 'bold'
        }
      }
      case 'title1':
        return {
          fontSize: 15,
          fontWeight: 'bold',
          color: 'black',
        };
      case 'small-grey':
        return {
          fontSize: 13,
          color: '#595959',
          opacity: 0.6,
        };
      case 'settings-title':
        return {
          fontSize: 18,
          color: '#2175D3',
          // lineHeight: multiplyLineHeight(type, 42)
        };
      case 'note':
        return {
          fontSize: 13,
          color: '#8b9cb5',
        };
      case 'header':
        return {
          fontSize: 23,
          color: 'black',
          fontWeight: 'bold',
          // lineHeight: multiplyLineHeight(type, 32)
        };
      case 'underline-bold':
        return {
          fontSize: 15,
          fontWeight: 'bold',
          textDecorationLine: 'underline',
        };
      case 'display-03-medium':
        return {
          fontSize: 28,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.01,
          // lineHeight: multiplyLineHeight(type, 28)
        };
      case 'display-04':
        return {
          fontSize: 24,
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.01,
          // lineHeight: multiplyLineHeight(type, 24)
        };
      case 'display-05':
        return {
          fontSize: 24,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.02,
          // lineHeight: multiplyLineHeight(type, 24)
        };
      case 'display-06':
        return {
          fontSize: 16,
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.02,
          // lineHeight: multiplyLineHeight(type, 16)
        };
      case 'display-07':
        return {
          fontSize: 20,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.02,
        };
      case 'display-08':
        return {
          fontSize: 24,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Regular',
          letterSpacing: -0.02,
          // lineHeight: multiplyLineHeight(type, 24)
        };
      case 'quotation-01':
        return {
          fontSize: 32,
          fontFamily: 'MavenPro-Regular',
          letterSpacing: -0.02,
          // lineHeight: multiplyLineHeight(type, 32)
        };
      case 'quotation-02':
        return {
          fontSize: 20,
          fontFamily: 'MavenPro-Regular',
          letterSpacing: -0.01,
          // lineHeight: multiplyLineHeight(type, 20)
        };
      // headings...
      case 'heading-01':
        return {
          fontSize: 18,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.01,
          // lineHeight: multiplyLineHeight(type, 18)
        };
      case 'heading-02':
        return {
          fontSize: 16,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          // lineHeight: multiplyLineHeight(type, 16)
        };
      case 'heading-03':
        return {
          fontSize: 14,
          fontFamily: 'MavenPro-Medium',
          // lineHeight: multiplyLineHeight(type, 14)
        };
      case 'heading-04':
        return {
          fontSize: 10,
          fontFamily: 'MavenPro-Medium',
          // lineHeight: multiplyLineHeight(type, 14)
        };
      case 'body-short-01':
        return {
          fontSize: 16,
          // fontWeight: '400',
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 16)
        };

      case 'body-short-02':
        return {
          fontSize: 14,
          // fontWeight: '400',
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 14)
        };
      case 'body-long-01':
        return {
          fontSize: 16,
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 16)
        };
      case 'body-long-02':
        return {
          fontSize: 14,
          // fontWeight: '400',
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 14)
        };
      case 'body-long-02-medium':
        return {
          fontSize: 14,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          // lineHeight: multiplyLineHeight(type, 14)
        };
      case 'body-long-02-highRegular':
        return {
          fontSize: 14,
          // fontWeight: '600',
          fontFamily: 'MavenPro-Medium',
        };
      case 'body-long-03':
        return {
          fontSize: 14,
          // fontWeight: '400',
          fontFamily: 'MavenPro-Medium',
          letterSpacing: -0.01,
        };

      case 'caption-01':
        return {
          fontSize: 12,
          // fontWeight: '400',
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 12)
        };

      case 'caption-01-highlight':
        return {
          fontSize: 12,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Medium',
          // lineHeight: multiplyLineHeight(type, 12)
        };

      case 'caption-01-highRegular':
        return {
          fontSize: 12,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Regular',
          // lineHeight: multiplyLineHeight(type, 12)
        };
      case 'caption-02-highRegular':
        return {
          fontSize: 32,
          // fontWeight: '500',
          fontFamily: 'MavenPro-Regular',
        };
      case 'caption-02':
        return {
          fontSize: 42,
          fontFamily: 'MavenPro-Medium',
          style: 'normal',
        };
      case 'helper-text-01':
        return {
          fontSize: 12,
          // fontWeight: '400',
          fontStyle: 'italic',
          // lineHeight: multiplyLineHeight(type, 12)
        };
      default:
        break;
    }
  };

  return (
    <Text
      style={[
        getStyleForText(type),
        { textAlign: textAlign ? textAlign : 'left' },
        textStyle,
        containerStyle,
        color && { color: color },
        { width: 'auto' },
      ]}
      onPress={onPress ? onPress : null}>
      {text}
    </Text>
  );
}
