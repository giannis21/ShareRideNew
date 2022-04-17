import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../utils/Colors';

export function ProgressStepBar({step}) {
  const {progressContainer, progressBar, absolute} = styles;
  let progress = 16.6;
  const getWidth = step => {
    switch (step) {
      case 1:
        return {width: `${progress}%`};
      case 2:
        return {width: `${progress * 2}%`};
      case 3:
        return {width: `${progress * 3}%`};
      case 4:
        return {width: `${progress * 4}%`};
      case 5:
        return {width: `${progress * 5}%`};
      default:
        return {width: '100%'};
    }
  };

  return (
    <View style={progressContainer}>
      <View style={[progressBar, absolute, getWidth(step)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    height: 6,
    backgroundColor: '#FAFAFA',
  },
  progressBar: {
    backgroundColor: colors.colorPrimary,
  },
  absolute: {
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
});
