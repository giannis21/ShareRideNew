import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../utils/Colors';

const THUMB_RADIUS = 16;

const Thumb = () => {
    return (
        <View style={styles.root} />
    );
};

const styles = StyleSheet.create({
    root: {
        width: THUMB_RADIUS,
        height: THUMB_RADIUS,
        borderRadius: THUMB_RADIUS,
        borderWidth: 2,
        borderColor: colors.colorPrimary,
        backgroundColor: colors.colorPrimary,
    },
});

export default memo(Thumb);