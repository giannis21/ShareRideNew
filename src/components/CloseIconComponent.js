import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';


export function CloseIconComponent({
    onPress,
    containerStyle
}) {


    return (

        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[styles.circleContainer, containerStyle]}>
            <Icon name="close" color='black' size={18} />
        </TouchableOpacity>



    );
}

const styles = StyleSheet.create({

    circle: {
        borderRadius: 100 / 2,
    },
    circleContainer: {
        borderRadius: 100 / 2,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1
    },
    container: {


    },

});
