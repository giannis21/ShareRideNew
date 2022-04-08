import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Spacer } from '../layout/Spacer';


export function MiddleStopsComponent({
    moreplaces,
}) {
    var _ = require('lodash');
    const [array, setArray] = useState([])

    useEffect(() => {
        if (typeof (moreplaces) === 'string') {
            setArray([...Array.from(JSON.parse(moreplaces))])
        } else {
            setArray(moreplaces)
        }
    }, [])

    const { container } = styles
    return (
        <View style={container}>

            {array.map((item1, index) => {

                return (
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="location-pin" size={20} color={colors.colorPrimary} />
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item1?.place}</Text>
                        <Spacer height={3} />
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({

    circle: {
        borderRadius: 100 / 2,
    },
    container: {
        marginStart: 16, marginVertical: 8, justifyContent: 'flex-start'
    },

});
