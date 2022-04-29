import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from 'react-native';
import {PostLayoutComponent} from '../../components/PostLayoutComponent';
import {BaseView} from '../../layout/BaseView';
import {Spacer} from '../../layout/Spacer';
import {routes} from '../../navigation/RouteNames';
import {
  addRemovePostToFavorites,
  deletePost,
  getFavoritePosts,
  getPostsUser,
} from '../../services/MainServices';
import {colors} from '../../utils/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {OpenImageModal} from '../../utils/OpenImageModal';
import {Loader} from '../../utils/Loader';
import {useIsFocused} from '@react-navigation/native';
import {InfoPopupModal} from '../../utils/InfoPopupModal';
import {constVar} from '../../utils/constStr';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import {TopContainerExtraFields} from '../../components/TopContainerExtraFields';
import {useDispatch, useSelector} from 'react-redux';
import {ADD_ACTIVE_POST, OPEN_HOC_MODAL} from '../../actions/types';
import {postExistsInFav} from '../../customSelectors/PostsSelectors';
import {getIsHocScreenActive} from '../../customSelectors/GeneralSelectors';

const MyPostsProfileScreen = ({navigation, route}) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [isRender, setIsRender] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [showContent, setShowContent] = React.useState(true);
  const [bottomModalTitle, setBottomModalTitle] = React.useState(null);
  const {height, width} = Dimensions.get('window');

  let isFocused = useIsFocused();
  let dispatch = useDispatch();
  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);
  const isHocScreenActive = useSelector(getIsHocScreenActive);

  // const handleBackButtonClick = async () => {
  //     console.log(isHocScreenActive)
  //     //   return true
  //     if (isHocScreenActive) {
  //         openHoc(false)
  //     } else {
  //         navigation.goBack()
  //     }

  //     return true;
  // }

  // useFocusEffect(useCallback(() => {
  //     BackHandler.addEventListener("hardwareBackPress5", handleBackButtonClick);
  //     return () => BackHandler.removeEventListener("hardwareBackPress5", handleBackButtonClick);
  // }, [isHocScreenActive]));

  useEffect(() => {
    if (myUser.email)
      getPostsUser({
        email: myUser.email,
        page: offset,
        successCallback,
        errorCallback,
      });
  }, []);

  const goBack = () => {
    navigation.goBack();
  };
  const successCallback = data => {
    setIsLoading(false);
    setDataSource([...dataSource, ...data.postUser]);
    setTotalPages(data.totalPages);
    setOffset(offset + 1);
    setShowContent(false);
  };
  const errorCallback = () => {
    setIsLoading(false);
    setShowContent(false);
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  const onProfileClick = email => {
    navigation.push(routes.PROFILE_SCREEN, {email: email});
  };

  const onMenuClicked = (item1, index) => {
    let postToBeDeleted = dataSource.find(
      item => item.post.postid === item1.post.postid,
    );
    setDeletedPost(postToBeDeleted);

    setIsModalVisible(true);
  };

  const onActionSheet = index => {
    setIsLoading(true);
    if (index === 2) {
      deletePost({
        postID: deletedPost.post.postid,
        successCallback: message => {
          dispatch(getFavoritePosts());
          let newData = dataSource.filter(obj => obj !== deletedPost);
          setDataSource(newData);
          setIsRender(!isRender);

          setInfoMessage({info: message, success: true});
          setIsLoading(false);
          showCustomLayout();
        },
        errorCallback: message => {
          setInfoMessage({info: message, success: false});
          setIsLoading(false);
          showCustomLayout();
        },
      });
      return;
    }

    addRemovePostToFavorites({
      postid: deletedPost.post.postid,
      successCallback: message => {
        setIsLoading(false);
        dispatch(getFavoritePosts());
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: message => {
        setIsLoading(false);
        setInfoMessage({info: message, success: false});
        showCustomLayout();
      },
    });
  };

  const renderFooter = () => {
    return !_.isEmpty(dataSource) && offset <= total_pages ? (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setIsLoading(true);
            getPostsUser({
              email: myUser.email,
              page: offset,
              successCallback,
              errorCallback,
            });
          }}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Φόρτωσε Περισσότερα...</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const dispatchPost = post => {
    dispatch({
      type: ADD_ACTIVE_POST,
      payload: post,
    });
  };
  const goToPostScreen = () => {
    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: false,
    });
  };
  const goToPreviewScreen = () => {
    navigation.navigate(routes.PREVIEW_INTERESTED_IN_ME_SCREEN);
  };
  const openHoc = (val = true) => {
    dispatch({type: OPEN_HOC_MODAL, payload: val});
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 8, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <TopContainerExtraFields
          onCloseContainer={goBack}
          title={'Τα post μου'}
        />

        {showContent ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height / 2 - 50,
            }}>
            <Text>Περιμένετε..</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <FlatList
              data={dataSource}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              keyExtractor={(item, index) => index}
              enableEmptySections={true}
              extraData={isRender}
              renderItem={item => {
                return (
                  <PostLayoutComponent
                    navigation={navigation}
                    key={item.item.postid}
                    showMenu={true}
                    item={item.item}
                    onMenuClicked={onMenuClicked}
                    showInterested={true}
                    openHocScreen={openHoc}
                    showMoreUsers={post => {
                      goToPreviewScreen();
                      dispatchPost(post);
                    }}
                    onPress={post => {
                      goToPostScreen();
                      dispatchPost(post);
                    }}
                  />
                );
              }}
              ListFooterComponent={renderFooter}
            />

            <OpenImageModal
              postId={deletedPost?.post?.postid}
              bottomTitle={bottomModalTitle}
              isVisible={isModalVisible}
              isPost={true}
              isFavoritePostScreen={false}
              closeAction={() => {
                setIsModalVisible(false);
                setDeletedPost(null);
              }}
              buttonPress={index => {
                setIsModalVisible(false);
                onActionSheet(index);
              }}
            />
            <Loader isLoading={isFocused ? isLoading : false} />
          </View>
        )}
      </View>
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
    </View>
  );
};

export default MyPostsProfileScreen;

const styles = StyleSheet.create({
  timer: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: 'white',
    height: 'auto',
    width: '100%',
    borderRadius: 23,
  },
  header: {
    fontSize: 23,
    alignSelf: 'center',
    marginStart: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  wrongPass: {
    fontSize: 13,
    fontWeight: '900',
    color: 'red',
  },
  topContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  absolute: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    top: 0,
  },
  box: {
    width: 55,
    alignSelf: 'center',

    height: 55,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 8,
    color: 'black',
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
