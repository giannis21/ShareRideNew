import React, { memo, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { colors } from '../utils/Colors';
import { NativeModules, StatusBarIOS } from 'react-native';
const { StatusBarManager } = NativeModules;
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
  iosBackgroundColor,
  barStyle,
  addStyleDynamically
}) {
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(response =>
        setStatusBarHeight(response.height + 1),
      );
    } else {
      if (addStyleDynamically) {
        StatusBar.setBackgroundColor(statusBarColor);
        StatusBar.setBarStyle(barStyle, true);
      }

    }
  }, [isFocused]);

  return (
    <SafeAreaView
      style={[
        containerStyle,
        {
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: removePadding ? 0 : 16,
        },
      ]}>
      {showStatusBar && (
        <StatusBar
          backgroundColor={statusBarColor}
          barStyle={barStyle ? barStyle : 'light-content'}
          hidden={false}
          translucent={false}
        />
      )}
      {Platform.OS === 'ios' && showStatusBar && (
        <View
          style={[
            styles.appBar,
            {
              backgroundColor: iosBackgroundColor
                ? iosBackgroundColor
                : colors.colorPrimary,
              height: statusBarHeight ? statusBarHeight : null,
            },
          ]}
        />
      )}

      {children}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  appBar: {
    width: '100%',
    zIndex: -1,
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
