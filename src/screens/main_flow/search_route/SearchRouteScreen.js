import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { BaseView } from '../../../layout/BaseView';
import { routes } from '../../../navigation/RouteNames';
import { createRequest, getFavoritePosts, getPlaceInfo, getRequests, getRequests2, getTerms, getUsersToRate, resetValues, searchForPosts } from '../../../services/MainServices';
import { colors } from '../../../utils/Colors';
import { Loader } from '../../../utils/Loader';
import { MainHeader } from '../../../utils/MainHeader';
import { filterKeys, getValue, keyNames, setValue } from '../../../utils/Storage';
import { BackHandler } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchLocationComponent } from '../../../components/SearchLocationComponent';
import { FiltersModal } from '../../../utils/FiltersModal';
import { constVar } from '../../../utils/constStr';
import { ADD_SEARCH_END_POINT, ADD_SEARCH_START_POINT, CLEAR_SEARCH_VALUES, GET_FAVORITE_ROUTES, GET_REQUESTS, HIDE_BOTTOM_TAB, SET_PROFILE_PHOTO } from '../../../actions/types';
import { SelectLocationComponent } from '../../../components/SelectLocationComponent';
import { Spacer } from '../../../layout/Spacer';
import { RoundButton } from '../../../Buttons/RoundButton';
import { SearchedPostsComponent } from '../../../components/SearchedPostsComponent';
import { CustomInfoLayout } from '../../../utils/CustomInfoLayout';
import moment from 'moment';
import { usePreventGoBack } from '../../../customHooks/usePreventGoBack';
import { InfoPopupModal } from '../../../utils/InfoPopupModal';
import { SearchScreenComponent } from '../../../components/SearchScreenComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FavDestComponent } from '../../../components/FavDestComponent';
import { createTable, getDBConnection, getFavorites } from '../../../database/db-service';
import SearchTopTabBar from '../../../components/SearchTopTabBar'
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';
import { NotificationsModal } from '../../../utils/NotificationsModal';
const SearchRouteScreen = ({ navigation, route }) => {
    var _ = require('lodash');

    const [isLoading, setIsLoading] = useState(false)
    const [openSearch, setOpenSearch] = useState({ from: true, open: false })
    const [openSearchedPost, setOpenSearchedPosts] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState({ info: '', success: false });
    const [total_pages, setTotalPages] = useState(1);
    const [dataSource, setDataSource] = useState([]);
    const [offset, setOffset] = useState(1);
    const [modalCloseVisible, setModalCloseVisible] = useState(false)
    const [lastActiveIndex, setLastActiveIndex] = useState(0)
    const [carouselItem, setCarouselItem] = useState(null)
    const [notificationsModalOpen, setNotificationModalOpen] = useState(false)

    const myUser = useSelector(state => state.authReducer.user)
    const post = useSelector(state => state.postReducer)
    const searchReducer = useSelector(state => state.searchReducer)


    const dispatch = useDispatch()
    const Tab = createMaterialTopTabNavigator();


    useEffect(() => {
        dispatch(getFavoritePosts())
        dispatch(getRequests())
        dispatch(getTerms())
        dispatch(getUsersToRate())

    }, [myUser.email])

    // useEffect(async () => {

    //     await FastImage.clearDiskCache().then(() => {
    //         console.log("image chaced")
    //     }).catch((err) => {
    //         console.log("eeeeerrrrr", err)
    //     })
    // }, [myUser.email])

    // // i retrive image from local storage only when i want 
    // useEffect(() => {
    //     if(myUser.photoProfile !==''){
    //         retrieveImage()
    //     }
    // }, [myUser.photoProfile])


    useEffect(() => {
        loadDataCallback()
    }, [searchReducer.triggerDatabase])

    useEffect(() => {
        if (openSearch.open || openSearchedPost) {
            dispatch({ type: HIDE_BOTTOM_TAB, payload: true })
        } else {
            dispatch({ type: HIDE_BOTTOM_TAB, payload: false })
        }
    }, [openSearch.open, openSearchedPost])

    const loadDataCallback = useCallback(async () => {
        try {
            const db = await getDBConnection();
            await createTable(db);
            getFavorites(myUser.email, db).then((data) => {
                if (data.length) {
                    dispatch({ type: GET_FAVORITE_ROUTES, payload: data })
                } else {
                    dispatch({ type: GET_FAVORITE_ROUTES, payload: [] })
                }
            })
        } catch (error) {
            console.error(error);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    }, [openSearch.open, openSearchedPost]));

    const retrieveImage = async () => {
        try {
            const path = `${RNFetchBlob.fs.dirs.DocumentDir}/images/${myUser.email}.png`;
            const data = await RNFetchBlob.fs.readFile(path, 'base64');
            dispatch({ type: SET_PROFILE_PHOTO, payload: data })
        } catch (error) {
            console.log("error.messag", error.message);
        }
    }

    const searchPosts = async () => {

        if ((post.searchStartplace === '' || post.searchEndplace === '') && lastActiveIndex !== 0) {
            setInfoMessage({ info: "Συμπλήρωσε και τα δύο πεδία πρώτα!", success: false })
            showCustomLayout()
            return
        }

        let sendObj = {
            data: {
                email: myUser.email,
                startplace: lastActiveIndex === 0 ? carouselItem?.startplace : post.searchStartplace,
                startcoord: lastActiveIndex === 0 ? carouselItem?.startcoord : post.searchStartcoord,
                endplace: lastActiveIndex === 0 ? carouselItem?.endplace : post.searchEndplace,
                endcoord: lastActiveIndex === 0 ? carouselItem?.endcoord : post.searchEndcoord,
                startdate: await getStartDate(),
                enddate: await getEndDate(),
                page: 1,
                cost: await getValue(filterKeys.maxCost) ?? null,
                age: await getStartAge(),
                age_end: await getEndAge(),
                car: await getCar(),
                cardate: await getValue(filterKeys.carAge) ?? 2000,
                gender: await getGender(),
                withReturn: await hasReturnDate(),
                petAllowed: await getPetAllowed(),
                returnStartDate: await getReturnStartDate(),
                returnEndDate: await getReturnEndDate()
            }
        }

        searchForPosts({
            sendObj,
            successCallback: ((data) => {
                setOpenSearchedPosts(true)

                setIsLoading(false)
                setDataSource([...dataSource, ...data.body.postUser]);
                setTotalPages(data.totalPages)
                setOffset(offset + 1)
            }),
            errorCallback: ((errorMessage) => {
                setInfoMessage({ info: errorMessage, success: false })
                showCustomLayout()
            })
        })

    }
    const getGender = async () => {
        let gender = await getValue(filterKeys.showMe)

        if (gender) {
            switch (gender) {
                case 'όλους': return null
                case 'άνδρες': return 'male'
                default: return 'female'
            }
        }

        return null

    }
    const getCar = async () => {
        let carMark = await getValue(filterKeys.carMark)

        if (carMark) {
            if (carMark === 'ΟΛΑ')
                return null
            else
                return carMark
        }
        return null

    }
    const getStartAge = async () => {
        let ageRange = await getValue(filterKeys.ageRange)
        if (ageRange) {
            return ageRange.split('-')[0]
        }
        return null
    }

    const getEndAge = async () => {
        let ageRange = await getValue(filterKeys.ageRange)
        if (ageRange) {
            return ageRange.split('-')[1]
        }
        return null
    }

    const hasReturnDate = async () => {

        let returnStartDate = await getValue(filterKeys.returnStartDate)
        if (returnStartDate && returnStartDate !== constVar.returnStartDate) {
            return true
        }
        return null

    }

    const getPetAllowed = async () => {
        let petAllowed = await getValue(filterKeys.allowPet)
        if (petAllowed && petAllowed === 'true') {
            return true
        }
        if (petAllowed && petAllowed === 'false') {
            return false
        }

        return null

    }
    const getReturnStartDate = async () => {
        let returnStartDate = await getValue(filterKeys.returnStartDate)
        if (returnStartDate && returnStartDate !== constVar.returnStartDate) {
            return moment(returnStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        return null
    }
    const getReturnEndDate = async () => {
        let returnEndDate = await getValue(filterKeys.returnEndDate)
        if (returnEndDate && returnEndDate !== constVar.returnEndDate) {
            return moment(returnEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        return null
    }
    const getStartDate = async () => {
        let startDate = await getValue(filterKeys.startDate)
        if (startDate && startDate !== constVar.initialDate) {
            return moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        return null
    }

    const getEndDate = async () => {
        let endDate = await getValue(filterKeys.endDate)
        if (endDate && endDate !== constVar.endDate) {
            return moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        return null
    }
    const resetValues = () => {
        dispatch({ type: CLEAR_SEARCH_VALUES, payload: {} })
    }

    const handleBackButtonClick = async () => {

        if (openSearch.open) {
            setOpenSearch({ from: true, open: false })
        } else if (openSearchedPost) {
            setOpenSearchedPosts(false)
        } else {
            setModalCloseVisible(true)
        }
        return true;
    }


    let resetArray = () => {
        setDataSource([]);
        setOpenSearchedPosts(false)
    }

    const getPlace = (place_id, place, isStartPoint) => {

        getPlaceInfo({
            place_id,
            successCallback: ((coordinates) => {
                if (openSearch.from !== true && post.searchStartcoord === coordinates) {

                    setInfoMessage({ info: "Έχεις ήδη προσθέσει αυτή την τοποθεσία ως αρχικό προορισμό!", success: false })
                    showCustomLayout()
                    return
                }

                if (openSearch.from === true && post.searchEndcoord === coordinates) {
                    setInfoMessage({ info: "Έχεις ήδη προσθέσει αυτή την τοποθεσία ως τελικό προορισμό!", success: false })
                    showCustomLayout()
                    return
                }

                dispatch({
                    type: getType(isStartPoint),
                    payload: [place, coordinates]
                })

            }),
            errorCallback: (() => { })
        })
    }

    function getType(isStartPoint) {
        return isStartPoint ? ADD_SEARCH_START_POINT : ADD_SEARCH_END_POINT
    }

    const showCustomLayout = (callback) => {
        setShowInfoModal(true)
        setTimeout(function () {
            setShowInfoModal(false)
            if (callback)
                callback()
        }, 2000);
    }


    const { addΤοFav, addStopStyle } = styles
    return (

        <BaseView statusBarColor={colors.colorPrimary} removePadding containerStyle={{ flex: 1 }}>
            <Loader isLoading={isLoading} />
            <MainHeader
                onClose={() => {
                    openSearchedPost ? resetArray() : setOpenSearch({ from: true, open: false });
                }}
                title={"Αναζήτηση διαδρομής"}
                showX={openSearch.open === true || openSearchedPost === true}
                onSettingsPress={() => {
                    navigation.navigate(routes.SETTINGS_SCREEN, { email: myUser.email })
                }}
                onLogout={() => {
                    resetValues(() => {
                        navigation.navigate(routes.AUTHSTACK, { screen: routes.LOGIN_SCREEN })
                    })
                }}
                onFilterPress={() => {
                    navigation.navigate(routes.FILTERS_SCREEN)
                }}
                onNotificationPress={() => {
                    setNotificationModalOpen(true)
                    //navigation.navigate(routes.FILTERS_SCREEN)
                }}
                onFavoritePostsPress={() => {
                    navigation.navigate(routes.FAVORITE_POSTS_SCREEN)
                }}
            />

            {!openSearch.open && !openSearchedPost && searchReducer.favoriteRoutes.length > 0 &&
                <View style={{ top: 0, right: 0, left: 0, bottom: 0, height: '100%' }}>
                    <Tab.Navigator
                        tabBar={(props) => (
                            <SearchTopTabBar {...props}
                                isSearchOpen={openSearch.open}
                                lastActiveIndex={lastActiveIndex}
                                onChangeIndex={(activeIndex) => { setLastActiveIndex(activeIndex) }} />
                        )}
                        screenOptions={{
                            tabBarLabelStyle: { textTransform: 'lowercase' },
                            swipeEnabled: lastActiveIndex === 1,
                        }}
                    >

                        <Tab.Screen name={constVar.favoritesTab}>
                            {(props) => (
                                <FavDestComponent
                                    onSearchPosts={searchPosts}
                                    onCarouselItemChange={(currentCarouselItem) => setCarouselItem(currentCarouselItem)} />
                            )}
                        </Tab.Screen>

                        <Tab.Screen name={constVar.searchTab}>
                            {(props) => (
                                <SearchScreenComponent
                                    navigation
                                    onSearchPosts={() => { searchPosts() }}
                                    onOpenSearch={(from, open) => {
                                        setOpenSearch({ from: from, open: open })
                                    }}
                                />
                            )}
                        </Tab.Screen>



                    </Tab.Navigator>

                </View>
            }

            {!openSearch.open && _.isEmpty(dataSource) &&
                <SearchScreenComponent
                    navigation
                    onSearchPosts={() => { searchPosts() }}
                    onOpenSearch={(from, open) => {
                        setOpenSearch({ from: from, open: open })
                    }}
                />
            }

            {openSearchedPost && !_.isEmpty(dataSource) &&
                <SearchedPostsComponent navigation={navigation} data={dataSource} offset={offset} total_pages={total_pages} />
            }

            {openSearch.open &&
                <SearchLocationComponent
                    from={openSearch.from}
                    onPress={(place_id, place, isStartPoint) => {
                        getPlace(place_id, place, isStartPoint)
                        setOpenSearch({ from: true, open: false })
                    }} />
            }
            <CustomInfoLayout
                isVisible={showInfoModal}
                title={infoMessage.info}
                icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
                success={infoMessage.success}
            />

            <InfoPopupModal
                preventAction={true}
                preventActionText={'Έξοδος'}
                isVisible={modalCloseVisible}
                description={'Είσαι σίγουρος θέλεις να κλείσεις την εφαρμογή;'}
                buttonText={'Όχι'}
                closeAction={() => {
                    setModalCloseVisible(false);
                }}
                buttonPress={() => { BackHandler.exitApp() }}
                descrStyle={true}
            />
            <NotificationsModal
                onSubmit={(rating, text) => { }}
                isVisible={notificationsModalOpen}
                onProfileClick={(email, toEdit) => {
                    setNotificationModalOpen(false)
                    navigation.navigate(routes.PROFILE_STACK, { screen: routes.PROFILE_SCREEN, params: { email: email } })
                }}
                closeAction={() => {
                    setNotificationModalOpen(false)
                }} />

        </BaseView >

    );

}

export default SearchRouteScreen

const styles = StyleSheet.create({
    addΤοFav: {
        paddingHorizontal: 13,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'baseline',

        borderRadius: 13,
        marginEnd: 10,

    },
    timer: {
        fontSize: 17,
        fontWeight: '900',
        textAlign: 'center'
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
    addStopStyle: {
        borderRadius: 22,
        paddingVertical: 3,
        paddingHorizontal: 10,
        alignSelf: 'baseline',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.colorPrimary,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
    }
});
