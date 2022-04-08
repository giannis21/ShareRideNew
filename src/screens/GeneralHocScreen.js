

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useIsFocused } from '@react-navigation/native';


import { useSelector, useDispatch } from 'react-redux';
import { BaseView } from '../layout/BaseView';
import { TopContainerExtraFields } from '../components/TopContainerExtraFields';
import { UserComponent } from '../components/UserComponent';
import { Loader } from '../utils/Loader';
import { CustomInfoLayout } from '../utils/CustomInfoLayout';
import { routes } from '../navigation/RouteNames';
import { getInterestedPerPost, verInterested } from '../services/MainServices';
import { colors } from '../utils/Colors';
import { getIsHocScreenActive, getIsHocScreenMinimize } from '../customSelectors/GeneralSelectors';
import { OPEN_HOC_MODAL } from '../actions/types';

const GeneralHocScreen = ({ navigation }) => {
    var _ = require('lodash');
    const [total_pages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [offset, setOffset] = useState(1);

    const [isRender, setIsRender] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState({ info: '', success: false });
    const [showContent, setShowContent] = useState(true)
    const { height, width } = Dimensions.get("window");

    let dispatch = useDispatch()
    let isFocused = useIsFocused()
    // const navigation = useNavigation();
    const isScreenActive = useSelector(getIsHocScreenActive);

    // const isMinimize = useSelector(getIsHocScreenMinimize);
    useEffect(() => {
        if (isScreenActive)
            setTimeout(() => {
                getUsers()
            }, 1000);
        else {
            // event.persist();
            // setDataSource([])
        }


    }, [isScreenActive])





    const onProfileClick = (email) => {
        navigation.push(routes.PROFILE_SCREEN, { email })
    }
    const getUsers = () => {
        getInterestedPerPost({
            postId: '1320',
            page: offset,
            successCallback,
            errorCallback
        })
    }
    const successCallback = (data) => {
        setIsLoading(false)

        setDataSource([...dataSource, ...data.users]);
        setTotalPages(data.totalPages)
        setOffset(offset + 1)
        setIsLoading(false)

    }
    const errorCallback = () => {
        setIsLoading(false)

    }


    const onActionSheet = (index) => {
        setIsLoading(true)
    };



    const showCustomLayout = (callback) => {
        setShowInfoModal(true)
        setTimeout(function () {
            setShowInfoModal(false)
            if (callback)
                callback()
        }, 2000);
    }


    const giveApproval = (piid, isVerified) => {
        let tempList = dataSource

        let updatedIndex = dataSource.findIndex((obj) => obj.piid === piid)
        let updated = dataSource.find((obj) => obj.piid === piid)
        updated.isVerified = null
        tempList[updatedIndex] = updated
        setDataSource(tempList)
        setIsRender(!isRender)
        verInterested({
            postid: '1320',
            piid: piid,
            successCallback: ((message) => {
                let tempList = dataSource

                updated.isVerified = !isVerified
                tempList[updatedIndex] = updated


                setDataSource(tempList)
                setIsRender(!isRender)

                setInfoMessage({ info: message, success: true })
                setIsLoading(false)
                showCustomLayout()
            }),
            errorCallback: ((message) => {

                let tempList = dataSource

                updated.isVerified = isVerified
                tempList[updatedIndex] = updated


                setDataSource(tempList)
                setIsRender(!isRender)

                setInfoMessage({ info: message, success: false })
                setIsLoading(false)
                showCustomLayout()

            })
        })
    }

    const renderFooter = () => {
        return (
            !_.isEmpty(dataSource) && (offset <= total_pages) ?
                (
                    <View style={styles.footer}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setIsLoading(true)
                                getUsers()
                            }}

                            style={styles.loadMoreBtn}>
                            <Text style={styles.btnText}>Φόρτωσε Περισσότερα...</Text>
                        </TouchableOpacity>
                    </View>
                ) : null

        );
    };
    const closeHoc = () => {
        dispatch({ type: OPEN_HOC_MODAL, payload: false })
    }
    const { userStyleAdded } = styles
    return (
        <BaseView containerStyle={styles.container}>

            <TopContainerExtraFields addMarginStart={10} onCloseContainer={closeHoc} title={'Ενδιαφερόμενοι του post'} />

            {!_.isEmpty(dataSource) ?
                <FlatList
                    style={{ marginHorizontal: 10 }}
                    data={dataSource}
                    extraData={isRender}
                    keyExtractor={(item, index) => index}
                    enableEmptySections={true}
                    renderItem={(item, index) => {

                        return <UserComponent
                            user={item.item}
                            index={index}
                            onProfileClick={onProfileClick}

                            giveApproval={giveApproval}
                            fillWidth />
                    }}
                    ListFooterComponent={renderFooter}
                /> : (
                    <View>

                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 110 }}>
                            <Text>Περιμένετε..</Text>
                        </View>
                    </View>
                )
            }



            <Loader isLoading={isFocused ? isLoading : false} />





            <CustomInfoLayout
                isVisible={showInfoModal}
                title={infoMessage.info}
                icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
                success={infoMessage.success}
            />
        </BaseView>

    );

}

export default GeneralHocScreen

const styles = StyleSheet.create({
    timer: {
        fontSize: 17,
        fontWeight: '900',
        textAlign: 'center'
    },
    userStyleAdded: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#c5dde3",
        alignSelf: 'baseline',
        width: 'auto',
        borderRadius: 13,
        marginEnd: 10,
    },
    timerContainer: {
        backgroundColor: 'white',
        height: 'auto', width: '100%',
        borderRadius: 23
    },
    header: {
        fontSize: 23,
        alignSelf: 'center',
        marginStart: 14,
        color: 'black',
        fontWeight: 'bold'
    },
    wrongPass: {
        fontSize: 13, fontWeight: '900', color: 'red'
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 16
    },
    container: {
        padding: 16,
        flexGrow: 1
    },
    input: {
        height: 40,
        marginBottom: 12,
        paddingVertical: 12,
        borderBottomWidth: 1
    },
    absolute: {
        position: 'absolute',
        left: 16,
        bottom: 0,
        top: 0
    },
    box: {
        width: 55,
        alignSelf: 'center',

        height: 55,
        backgroundColor: 'white',
        borderRadius: 8,
        marginRight: 8,
        color: 'black'
    },

    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: colors.colorPrimary,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },

    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'white'
    }

});
