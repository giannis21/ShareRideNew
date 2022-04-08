/* eslint-disable react-native/no-inline-styles */
import { Dimensions, Easing, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { getIsHocScreenActive, getIsHocScreenMinimize } from '../../customSelectors/GeneralSelectors';

const ModalAnimationHOC = ({ children }) => {
  const isScreenActive = useSelector(getIsHocScreenActive);
  const isMinimize = useSelector(getIsHocScreenMinimize);

  const transitionAnim = useRef(
    new Animated.Value(Dimensions.get('window').height)
  ).current;

  useEffect(() => {
    if (isScreenActive) {
      openHocAnimation();
    } else
      closeHocAnimation();
  }, [isScreenActive, isMinimize]);

  const openHocAnimation = () => {
    Animated.timing(transitionAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.circle,
      useNativeDriver: false
    }).start();
  };

  const closeHocAnimation = () => {
    Animated.timing(transitionAnim, {
      toValue: Dimensions.get('window').height + 50,
      duration: 400,
      easing: Easing.circle,
      useNativeDriver: false
    }).start();
  };

  return (
    <Animated.View style={{ position: 'absolute', top: transitionAnim }}>
      {children}
    </Animated.View>
  );
};

export default ModalAnimationHOC;
