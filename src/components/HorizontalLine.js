import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';


export function HorizontalLine({
    containerStyle
}) {


    return (
        <View style={[styles.container, containerStyle]} />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor:
            colors.CoolGray1,
        height: 1
    }
});
