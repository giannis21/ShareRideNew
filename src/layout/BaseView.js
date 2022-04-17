import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useIsFocused from '@react-navigation/native';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {colors} from '../utils/Colors';
const STATUSBAR_HEIGHT = Platform.OS === 'android' ? 0 : 50;

export function BaseView({
  edges,
  light,
  statusBarColor,
  children,
  translucent,
  containerStyle,
  removePadding,
  showStatusBar,
}) {
  // StatusBar.setBackgroundColor(colors.colorPrimary, false);
  return (
    <SafeAreaView
      edges={edges || []}
      style={[
        {flex: 1},
        {backgroundColor: 'white', paddingHorizontal: removePadding ? 0 : 16},
      ]}>
      {showStatusBar && (
        <StatusBar
          backgroundColor={
            Platform.OS === 'ios'
              ? 'white'
              : statusBarColor
              ? statusBarColor
              : 'black'
          }
          barStyle={'dark-content'}
          hidden={false}
          translucent={translucent}
        />
      )}
      {showStatusBar && (
        <View
          style={[
            styles.appBar,
            {
              backgroundColor: 'white',
            },
          ]}
        />
      )}

      {children}
    </SafeAreaView>
    // <SafeAreaView
    //   edges={['top', 'bottom']}
    //   style={
    //     containerStyle
    //       ? containerStyle
    //       : {
    //           flex: 1,
    //           paddingHorizontal: removePadding ? 0 : 16,
    //           backgroundColor: 'white',
    //         }
    //   }>
    //   <StatusBar
    //     backgroundColor={'white'}
    //     barStyle={!light ? 'light-content' : 'dark-content'}
    //     hidden={false}
    //     translucent={false}
    //   />
    //   {showStatusBar && (
    //     <View
    //       style={[
    //         styles.appBar,
    //         {
    //           backgroundColor: colors.colorPrimary,
    //         },
    //       ]}
    //     />
    //   )}

    //   {children}
    // </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  appBar: {
    height: STATUSBAR_HEIGHT,
    width: '100%',
    zIndex: -1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
