import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
            setError({ state: true, message: 'Η ημερομηνία που επιλέξατε είναι περασμένη' })
            return
        }

        const differenceInDays = moment(selectedDate).diff(nowOnlyDate, 'days');

        if (differenceInDays > 30) {
            setError({ state: true, message: 'Μπορείς να επιλέξεις ημερομηνία μέχρι και 30 μέρες απο σήμερα!' })
            return
        }

        let dateInputSelection = isFiltersScreen ? filtersReducer.radioSelected : post.radioSelected

        switch (dateInputSelection) {
            case 0: {
                if (getEndDate() !== constVar.endDate) {
                    let endDate = moment(getEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (endDate <= selectedDate) {
                        setError({ state: true, message: 'Η αρχική ημερομηνία πρέπει να προηγείται της τελικής!' })
                        return
                    }
                }
                if (getReturnStartDate() !== constVar.returnStartDate) {
                    let returnStartDate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (selectedDate >= returnStartDate) {
                        setError({ state: true, message: 'Η αρχική ημερομηνία πρέπει να προηγείται της αρχικής της επιστροφής!' })
                        return
                    }
                }
                break
            }
            case 1: { //εχω επιλεξει την τελικη αφετηριας
                if (getStartDate() !== constVar.initialDate) {
                    let startdate = moment(getStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (startdate >= selectedDate) {
                        setError({ state: true, message: 'Η αρχική ημερομηνία πρέπει να προηγείται της τελικής!' })
                        return
                    }
                }
                if (getReturnStartDate() !== constVar.returnStartDate) {
                    let returnStartdate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')
                    if (selectedDate >= returnStartdate) {
                        setError({ state: true, message: 'Η τελική ημερομηνία αναχώρησης πρέπει να προηγείται της αρχικής της επιστροφής!' })
                        return
                    }
                }
                break
            }
            case 2: { //εχω επιλεξει την τελικη αφετηριας
                if (getEndDate() !== constVar.endDate) {
                    let endDate = moment(getEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (endDate >= selectedDate) {
                        setError({ state: true, message: 'Η τελική ημερομηνία αναχώρησης πρέπει να προηγείται της αρχικής της επιστροφής!' })
                        return
                    }
                }
                if (getReturnEndDate() !== constVar.returnEndDate) {
                    let returnEndDate = moment(getReturnEndDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (selectedDate >= returnEndDate) {
                        setError({ state: true, message: 'Η αρχική ημερομηνία επιστροφής πρέπει να προηγείται της τελικής της επιστροφής!' })
                        return
                    }
                }
                break
            }
            case 3: {
                if (getReturnStartDate() !== constVar.returnStartDate) {
                    let returnStartDate = moment(getReturnStartDate(), 'DD/MM/YYYY').format('YYYY-MM-DD')

                    if (returnStartDate >= selectedDate) {
                        setError({ state: true, message: 'Η αρχική ημερομηνία επιστροφής πρέπει να προηγείται της τελικής της επιστροφής!' })
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
                    {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
                    <View style={{ width: '100%', backgroundColor: colors.CoolGray1, height: 1, marginTop: 10 }} />
                    <TouchableOpacity activeOpacity={0.9} style={[{ padding: 10 }, container]} onPress={checkDate}>
                        <Text style={[textStyle, { color: 'black' }]}>Προσθήκη</Text>
                    </TouchableOpacity>

                </View>

                <Spacer height={10} />
                <TouchableOpacity activeOpacity={0.9} style={[{ padding: 10 }, container]} onPress={() => buttonPress(2)}>
                    <Text style={[textStyle, { color: 'red' }]}>Άκυρο</Text>
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
