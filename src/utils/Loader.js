import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Easing, Modal} from 'react-native';
import {View, StyleSheet, Animated} from 'react-native';
//import { Easing } from 'react-native-reanimated';
import {colors} from './Colors';

export function Loader({isLoading}) {
  const val = useRef(new Animated.Value(0));
  let anim = useRef(
    Animated.loop(
      Animated.timing(val.current, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ),
  ).current;
  let stopped = true;
  let isFocused = useIsFocused();
  let spin = val.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const loopAnimation = () => {
    if (stopped || isFocused) {
      anim.reset();
      anim.start(() => loopAnimation());
    }
  };
  useEffect(() => {
    loopAnimation();
  }, [anim, isLoading]);

  const renderLoader = () => {
    return (
      <View style={styles.activityIndicatorContainer}>
        <View style={styles.activityIndicatorWrapper}>
          <View style={styles.container}>
            <View style={styles.highlightRoundBox}>
              <Animated.View
                style={[styles.containerInside, {transform: [{rotate: spin}]}]}>
                <View style={styles.loadingStyle}>
                  <View style={[styles.edge, {left: 0.2}]} />
                  <View style={[styles.edge, {right: 0.2}]} />
                </View>
              </Animated.View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <Modal style={styles.loading} transparent={true} animationType={'none'}>
        {renderLoader()}
      </Modal>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 155,
    height: 155,
  },
  containerInside: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 155,
    height: 155,
    borderColor: colors.blue200,
  },

  activityIndicatorContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: colors.popupOverlay,
  },
  activityIndicatorWrapper: {
    height: 80,
    width: 80,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  highlightRoundBox: {
    position: 'relative',
    marginTop: 11,
    marginBottom: 27,
    marginLeft: 13,
    marginRight: 8,
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingStyle: {
    position: 'relative',
    borderRadius: 50,
    width: 64,
    height: 64,
    borderWidth: 8,
    borderColor: colors.blue50,
    borderTopColor: colors.colorPrimary,
  },
  edge: {
    position: 'absolute',
    borderRadius: 50,
    width: 7.3,
    height: 7.3,
    backgroundColor: colors.colorPrimary,
    top: 0.8,
  },
});
