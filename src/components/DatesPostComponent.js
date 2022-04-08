



import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Spacer } from '../layout/Spacer';
import { colors } from '../utils/Colors';
import { ViewRow } from './HOCS/ViewRow';



export function DatesPostComponent({
    item,
    style,
    size
}) {
    var _ = require('lodash');




    const { textStyle, textStyle1, date, date1, leftContainer, rightContainer, container, rightContainerView, locationsLine, heartContainer, bottomContainer, seats } = styles

    return (
        <View style={style}>
            <Text style={size === 'big' ? textStyle1 : textStyle}>Αναχώρηση</Text>

            <ViewRow style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>{item.post.startdate}</Text>
                {item.post.startdate !== item.post.enddate &&
                    <ViewRow style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#595959', opacity: 0.6, marginHorizontal: 5 }}>έως</Text>

                        <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>{item.post.enddate}</Text>
                    </ViewRow>

                }

            </ViewRow>


            {item.post.withReturn === true &&
                <View>
                    <Text style={[{ marginTop: 10 }, size === 'big' ? textStyle1 : textStyle]}>επιστροφή</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <ViewRow style={{ marginTop: 10 }}>
                            <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>{item.post.returnStartDate}</Text>
                            {item.post.returnStartDate !== item.post.returnEndDate &&
                                <ViewRow style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#595959', opacity: 0.6, marginHorizontal: 5 }}>έως</Text>

                                    <Text style={[date, { fontSize: size === 'big' ? 15 : 10 }]}>{item.post.returnEndDate}</Text>
                                </ViewRow>
                            }

                        </ViewRow>


                    </View>

                </View>
            }

        </View >
    )
}

const styles = StyleSheet.create({
    locationsLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 9,
        right: 0,
        backgroundColor: colors.CoolGray1.toString(),
        width: 1,
        marginVertical: 15
    },
    date: {
        color: 'white',
        borderRadius: 22,
        paddingVertical: 2,

        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        backgroundColor: colors.colorPrimary,
    },
    textStyle: { fontSize: 13, fontWeight: 'bold', alignSelf: 'center' },
    textStyle1: { fontSize: 16, fontWeight: 'bold', paddingStart: 16, marginTop: 15, backgroundColor: colors.CoolGray2, paddingVertical: 1 },
});
