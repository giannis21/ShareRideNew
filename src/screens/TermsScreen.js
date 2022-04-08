import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, TextInput, Keyboard, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BaseView } from '../layout/BaseView';
import { colors } from '../utils/Colors';
import { constVar } from '../utils/constStr'
import { CloseIconComponent } from '../components/CloseIconComponent';
import { useSelector } from 'react-redux';

const TermsScreen = ({ navigation, route }) => {
    var _ = require('lodash');
    const generalReducer = useSelector(state => state.generalReducer)

    return (
        <BaseView statusBarColor={colors.colorPrimary} removePadding>

            <KeyboardAwareScrollView
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustContentInsets={true}
                bounces={true}
                keyboardShouldPersistTaps={'handled'}>
                <View style={styles.topContainer}>

                    <CloseIconComponent onPress={() => { navigation.goBack() }} />
                    <Text style={styles.header}>{constVar.termsTitle}</Text>
                </View>
                <Text style={{ marginHorizontal: 10, marginVertical: 10 }}>{generalReducer.terms}</Text>
            </KeyboardAwareScrollView>
        </BaseView >
    );

}

export default TermsScreen

const styles = StyleSheet.create({
    header: {
        fontSize: 23,
        marginStart: 14,
        color: 'black',
        fontWeight: 'bold',

    },
    wrongPass: {
        fontSize: 13, fontWeight: '900', color: 'red'
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginStart: 10
    },
})      