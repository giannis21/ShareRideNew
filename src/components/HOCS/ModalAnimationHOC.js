/* eslint-disable react-native/no-inline-styles */
import { Dimensions, Easing, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import {
  getIsHocScreenActive,
  getIsHocScreenMinimize,
} from '../../customSelectors/GeneralSelectors';

const ModalAnimationHOC = ({ children }) => {
  const isScreenActive = useSelector(getIsHocScreenActive);
  const isMinimize = useSelector(getIsHocScreenMinimize);

  const transitionAnim = useRef(
    new Animated.Value(-(Dimensions.get('window').height + 400)),
  ).current;

  useEffect(() => {
    if (isScreenActive) {
      openHocAnimation();
    } else closeHocAnimation();
  }, [isScreenActive, isMinimize]);

  const openHocAnimation = () => {
    Animated.spring(transitionAnim, {
      toValue: 0,
      duration: 200,
      friction: 5,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  const closeHocAnimation = () => {
    Animated.timing(transitionAnim, {
      toValue: -(Dimensions.get('window').height + 100),
      duration: 200,
      easing: Easing.circle,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ translateY: transitionAnim }],
        backgroundColor: 'transparent',
      }}>
      {children}
    </Animated.View>
  );
};

export default ModalAnimationHOC;
