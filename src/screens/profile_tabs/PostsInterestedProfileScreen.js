import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { PostLayoutComponent } from '../../components/PostLayoutComponent';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';

import { routes } from '../../navigation/RouteNames';
import { getInterested, getInterestedPerUser, showInterest } from '../../services/MainServices';
import { colors } from '../../utils/Colors';
import { CustomInfoLayout } from '../../utils/CustomInfoLayout';
import { Loader } from '../../utils/Loader';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { ADD_ACTIVE_POST } from '../../actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

const PostsInterestedProfileScreen = ({ navigation, route }) => {
    var _ = require('lodash');
    const [total_pages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isRender, setIsRender] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState({ info: '', success: false });
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [deletedPost, setDeletedPost] = useState(null);
    const [showPlaceholder, setShowPlaceholder] = React.useState(true)
    const { height, width } = Dimensions.get("window");
    const myUser = useSelector(state => state.authReducer.user)
    const navigation1 = useNavigation();
    let dispatch = useDispatch()
    let isFocused = useIsFocused()

    const goBack = () => {
        navigation.goBack()
    }

    useEffect(() => {
        if (route.params.email)
            getInterestedPerUser({
                email: route.params.email,
                successCallback,
                errorCallback
            })
    }, []);

    useEffect(() => {
        if (isFocused && route?.params?.postId) {
            let likedPost = dataSource.find((item) => item.post.postid === route?.params?.postId)
            likedPost.interested = !likedPost.interested
            dataSource[dataSource.indexOf(likedPost)] = likedPost
            setDataSource(dataSource)
            setIsRender(!isRender)
            navigation.setParams({ postId: null });
        }

    }, [isFocused])

    useEffect(() => {
        // if (isFocused)
        //     dispatch({
        //         type: ADD_ACTIVE_POST,
        //         payload: {}
        //     })
    }, [isFocused])

    const showCustomLayout = (callback) => {
        setShowInfoModal(true)
        setTimeout(function () {
            setShowInfoModal(false)
            if (callback)
                callback()
        }, 2000);
    }

    const successCallback = (data) => {
        setDataSource(data.postUser);
        setTotalPages(data.totalPages)
        setLoading(false)
        setShowPlaceholder(false)
    }
    const errorCallback = () => {
        setLoading(false)
        setShowPlaceholder(false)
    }


    const onProfileClick = (email) => {
        try {
            navigation.push(routes.PROFILE_SCREEN, { email: email })
        } catch (err) {
            console.log("dadsa", err)
        }

    }
    const onLikeClick = (postId, index) => {
        setLoading(true)
        showInterest({
            email: myUser.email,
            postId,
            successCallback: ((message) => {
                setLoading(false)
                let likedPost = dataSource.find((item) => item.post.postid === postId)


                likedPost.interested = !likedPost.interested
                dataSource[index] = likedPost
                setDataSource(dataSource)
                setIsRender(!isRender)
                setInfoMessage({ info: message, success: true })
                showCustomLayout()
            }),
            errorCallback: ((message) => {
                setLoading(false)
                setInfoMessage({ info: message, success: false })
                showCustomLayout()
            })
        })
    }
    const onMenuClicked = (item1, index) => {
        let postToBeDeleted = dataSource.find((item) => item.post.postid === item1.post.postid)
        setDeletedPost(postToBeDeleted)
        setIsModalVisible(true)

        //   console.log(item.post.postid, item.user.fullname)
    }
    const showMoreUsers = (post) => {


    }
    const onActionSheet = (index) => {
        let newData = dataSource.filter((obj) => obj !== deletedPost)
        setDataSource(newData)
        setIsRender(!isRender)
        // likedPost.interested = !likedPost.interested
        // dataSource[index] = likedPost
        // setDataSource(dataSource)

    };
    return (
        <BaseView containerStyle={{ flex: 1, paddingHorizontal: 8, backgroundColor: 'white' }}>
            <View style={styles.container}>
                <TopContainerExtraFields onCloseContainer={goBack} title={'Post που ενδιαφέρομαι'} />

                {showPlaceholder ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: (height / 2) - 50 }}>
                        <Text>Περιμένετε..</Text>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <Spacer height={15} />
                        <FlatList
                            data={dataSource}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 10 }} />
                            )}
                            extraData={isRender}
                            keyExtractor={(item, index) => 'item' + index}
                            //   enableEmptySections={true}
                            renderItem={(item, index) => {

                                return <PostLayoutComponent
                                    showFavoriteIcon={true}
                                    showMenu={false}
                                    item={item.item}
                                    index
                                    onMenuClicked={onMenuClicked}
                                    onProfileClick={onProfileClick}
                                    onLikeClick={onLikeClick}
                                    onPress={(post) => {
                                        navigation.navigate(routes.POST_PREVIEW_SCREEN, { showFavoriteIcon: true, isPostInterested: true })
                                        dispatch({
                                            type: ADD_ACTIVE_POST,
                                            payload: post
                                        })
                                    }}
                                />
                            }}

                        />
                    </View>
                )



                }

                <CustomInfoLayout
                    isVisible={showInfoModal}
                    title={infoMessage.info}
                    icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
                    success={infoMessage.success}
                />
                <OpenImageModal
                    isVisible={isModalVisible}
                    isPost={true}
                    closeAction={() => {
                        setIsModalVisible(false);
                        setDeletedPost(null)
                    }}
                    buttonPress={(index) => {
                        setIsModalVisible(false);
                        onActionSheet(index)
                    }}

                />
                <Loader isLoading={loading} />
            </View>
        </BaseView >

    );

}

export default PostsInterestedProfileScreen

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
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
});
