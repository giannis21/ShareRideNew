import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../utils/Colors';

export function ProgressStepBar({step}) {
  const {progressContainer, progressBar, absolute} = styles;

  const getWidth = step => {
    switch (step) {
      case 1:
        return {width: '25%'};
      case 2:
        return {width: '50%'};
      case 3:
        return {width: '75%'};
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
