import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = ({ color, tab, onPress, icon }) => {
    return (
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={onPress}>
            {icon && <Ionicons name={icon} size={20} color={color} />}
            <Text style={{ color }}>{tab.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
});

export default Tab;