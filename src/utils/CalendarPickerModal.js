import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { CustomInput } from './CustomInput';
import { colors } from './Colors';
import { RoundButton } from '../Buttons/RoundButton';
import { Spacer } from '../layout/Spacer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import { constVar } from './constStr';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_END_DATE, ADD_END_DATE_FILTERS, ADD_RETURN_END_DATE, ADD_RETURN_END_DATE_FILTERS, ADD_RETURN_START_DATE, ADD_RETURN_START_DATE_FILTERS, ADD_START_DATE, ADD_START_DATE_FILTERS } from '../actions/types';
import moment from 'moment';
import { regex } from './Regex';
export function CalendarPickerModal({
    isFiltersScreen,
    closeAction,
    title,
    titleType,
    description,
    buttonText,
    closeText,
    buttonPress,
    isVisible,

}) {
    const { modal, container, textStyle } = styles;
    const [date, setDate] = useState(new Date())
    const [error, setError] = useState({ state: false, message: '' })

    const post = useSelector(state => state.postReducer)
    const filtersReducer = useSelector(state => state.filtersReducer)
    const content = useSelector(state => state.contentReducer.content);
    let dispatch = useDispatch()


    const getEndDate = () => {
        return isFiltersScreen ? filtersReducer.enddate : post.enddate
    }

    const getStartDate = () => {
        return isFiltersScreen ? filtersReducer.startdate : post.startdate
    }

    const getReturnStartDate = () => {
        return isFiltersScreen ? filtersReducer.returnStartDate : post.returnStartDate
    }
    const getReturnEndDate = () => {
        return isFiltersScreen ? filtersReducer.returnEndDate : post.returnEndDate
    }

    const checkDate = () => {
        let selectedDate = moment(date, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD')
        let nowOnlyDate = moment(new Date(), 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD')
        if (nowOnlyDate > selectedDate) {
            setError({ state: true, message: content.datePassed })
            return
        }


        const differenceInDays = moment(selectedDate).diff(nowOnlyDate, 'days');

        if (differenceInDays > 30) {
            setError({ state: true, message: content.selectDateUpTo30 })
            return
        }

        let dateInputSelection = isFiltersScreen ? filtersReducer.radioSelected : post.radioSelected

        switch (dateInputSelection) {
            case 0: {
                if (regex.date.test(getEndDate())) {
                    console.log(endDate, selectedDate)
                    let endDate = moment(getEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (endDate <= selectedDate) {
                        setError({ state: true, message: content.initialFirstThanFinal })
                        return
                    }
                }
                if (regex.date.test(getReturnStartDate())) {
                    let returnStartDate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (selectedDate >= returnStartDate) {
                        setError({ state: true, message: content.initialFirstThanInitialReturn })
                        return
                    }
                }
                break
            }
            case 1: { //εχω επιλεξει την τελικη αφετηριας

                if (regex.date.test(getStartDate())) {
                    let startdate = moment(getStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (startdate >= selectedDate) {
                        setError({ state: true, message: content.initialFirstThanFinal })
                        return
                    }
                }

                if (regex.date.test(getReturnStartDate())) {
                    let returnStartdate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (selectedDate >= returnStartdate) {
                        setError({ state: true, message: content.finalFirstThanInitialReturn })
                        return
                    }
                }
                break
            }
            case 2: {

                if (regex.date.test(getEndDate())) {
                    let endDate = moment(getEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (endDate >= selectedDate) {
                        setError({ state: true, message: content.initialReturnFirstThanFinalDepart })
                        return
                    }
                }
                if (regex.date.test(getReturnEndDate())) {
                    let returnEndDate = moment(getReturnEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (selectedDate >= returnEndDate) {
                        setError({ state: true, message: content.initialFirstThanFinalReturn })
                        return
                    }
                }
                break
            }
            case 3: {
                if (regex.date.test(getReturnStartDate())) {
                    let returnStartDate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (returnStartDate >= selectedDate) {
                        setError({ state: true, message: content.initialFirstThanFinalReturn })
                        return
                    }
                }
                if (regex.date.test(getEndDate())) {
                    let endDate = moment(getEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (endDate >= selectedDate) {
                        setError({ state: true, message: content.departFinalFirstReturnFinal })
                        return
                    }
                }

                if (regex.date.test(getStartDate())) {
                    let startDate = moment(getStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (startDate >= selectedDate) {
                        setError({ state: true, message: content.initialDepartFirstThanFinalReturn })
                        return
                    }
                }
                break

            }
        }



        addToReducer(dateInputSelection, date)


        buttonPress(1)
    }


    const addToReducer = (selectedValue, date) => {
        let selectedDate = moment(date, 'YYYY-MM-DDTHH:mm:ssZ').format('DD/MM/YYYY')
        if (selectedValue === 0 && dispatch({ type: getType(0), payload: selectedDate }))
            return
        if (selectedValue === 1 && dispatch({ type: getType(1), payload: selectedDate }))
            return
        if (selectedValue === 2 && dispatch({ type: getType(2), payload: selectedDate }))
            return
        if (selectedValue === 3 && dispatch({ type: getType(3), payload: selectedDate }))
            return

    }

    const getType = (selection) => {
        switch (selection) {
            case 0:
                return isFiltersScreen ? ADD_START_DATE_FILTERS : ADD_START_DATE
            case 1:
                return isFiltersScreen ? ADD_END_DATE_FILTERS : ADD_END_DATE
            case 2:
                return isFiltersScreen ? ADD_RETURN_START_DATE_FILTERS : ADD_RETURN_START_DATE
            case 3:
                return isFiltersScreen ? ADD_RETURN_END_DATE_FILTERS : ADD_RETURN_END_DATE

        }
    }
    const closeModal = () => {
        setError({ state: false, message: '' })
        closeAction()
    }
    return (
        <View>
            <Modal
                isVisible={isVisible}
                style={modal}
                onBackdropPress={closeModal}
                onSwipeComplete={closeModal}
                swipeDirection="down"
                useNativeDriver={true}
            >
                <View style={container}>
                    <DatePicker
                        mode="date"
                        open={true}
                        date={date}
                        onDateChange={(date) => {
                            setDate(date);
                            setError(false)
                        }}
                        onConfirm={(date) => {

                        }}
                        onCancel={() => {
                            // setOpen(false)
                        }}
                    />
                    {error ? <Text style={{ color: 'red' }}>{error.message}</Text> : null}
                    <View style={{ width: '100%', backgroundColor: colors.CoolGray1, height: 1, marginTop: 10 }} />
                    <TouchableOpacity activeOpacity={0.9} style={[{ padding: 10, backgroundColor: 'black' }, container]} onPress={checkDate}>
                        <Text style={[textStyle, { color: 'black', paddingHorizontal: 60 }]}>{content.go}</Text>
                    </TouchableOpacity>

                </View>

                <Spacer height={10} />
                <TouchableOpacity activeOpacity={0.9} style={[{ padding: 10 }, container]} onPress={() => buttonPress(2)}>
                    <Text style={[textStyle, { color: 'red' }]}>{content.cancel}</Text>
                </TouchableOpacity>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        fontSize: 17
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 10,

    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: 'auto',
        paddingHorizontal: 10,
        alignItems: 'center',
        paddingTop: 10
    },
    descriptionStyle: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        textAlign: 'center'
    }
});
