import React, {useState, useEffect, useRef} from 'react';
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
} from 'react-native';
import {PostLayoutComponent} from '../../components/PostLayoutComponent';
import {Spacer} from '../../layout/Spacer';
import {routes} from '../../navigation/RouteNames';
import {
  addRemovePostToFavorites,
  deletePost,
  getFavoritePosts,
  getPostsUser,
} from '../../services/MainServices';
import {colors} from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import {OpenImageModal} from '../../utils/OpenImageModal';
import {Loader} from '../../utils/Loader';
import {useIsFocused} from '@react-navigation/native';
import {InfoPopupModal} from '../../utils/InfoPopupModal';
import {constVar} from '../../utils/constStr';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import {TopContainerExtraFields} from '../../components/TopContainerExtraFields';
import {useDispatch, useSelector} from 'react-redux';
import {ADD_ACTIVE_POST, SET_POST_SCREEN_VALUES} from '../../actions/types';
import {BaseView} from '../../layout/BaseView';
import Tooltip from '../../components/tooltip/Tooltip';
import {filterKeys, getValue, keyNames, setValue} from '../../utils/Storage';

const FavoritePostsScreen = ({navigation, route}) => {
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
  const tooltipRef = useRef();

  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);

  useEffect(() => {
    setDataSource(post.favoritePosts);
  }, [post.favoritePosts.length]);

  useEffect(() => {
    if (isFocused) toggleTooltip();
  }, [isFocused]);

  const toggleTooltip = async () => {
    let isFirstTime = await getValue(keyNames.favoritePostsBannerShown);
    console.log(isFirstTime);
    setTimeout(() => {
      setValue(keyNames.favoritePostsBannerShown, 'false');
      if (isFirstTime === undefined && isFocused) {
        tooltipRef?.current?.toggleTooltip();
      }
    }, 1000);
  };

  const goBack = () => {
    navigation.goBack();
  };
  const successCallback = data => {
    setIsLoading(false);
    setDataSource([...dataSource, ...data.postUser]);
    setTotalPages(data.totalPages);
    setOffset(offset + 1);
  };
  const errorCallback = () => {
    setIsLoading(false);
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
    if (index === 1) {
      addRemovePostToFavorites({
        postid: deletedPost.post.postid,
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
          showCustomLayout();
        },
      });
      return;
    }

    deletePost({
      postID: deletedPost.post.postid,
      successCallback: message => {
        dispatch(getFavoritePosts());
        setInfoMessage({info: message, success: true});
        setIsLoading(false);
        showCustomLayout();
      },
      errorCallback: message => {
        setInfoMessage({info: message, success: false});
        showCustomLayout();
      },
    });
  };

  const goToCreatePost = item => {
    let morePlaces = [];
    morePlaces = morePlaces.concat(item.post.moreplaces);

    dispatch({
      type: SET_POST_SCREEN_VALUES,
      payload: {
        moreplaces: item.post.moreplaces,
        startplace: item.post.startplace,
        startcoord: item.post.startcoord,
        endcoord: item.post.endcoord,
        endplace: item.post.endplace,
      },
    });

    navigation.navigate(constVar.createPostBottomTab, {
      screen: routes.CREATE_POST_SCREEN,
      params: {
        comment: item.post.comment,
        cost: item.post.costperseat,
        seats: item.post.numseats,
        petAllowed: item.post.petAllowed,
      },
    });
  };
  return (
    <BaseView
      removePadding
      showStatusBar={Platform.OS === 'android' ? true : false}
      statusBarColor={'black'}>
      <View style={{position: 'absolute', width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <Tooltip
            skipAndroidStatusBar={true}
            disabled={true}
            ref={tooltipRef}
            width={width / 1.2}
            height={100}
            backgroundColor={colors.colorPrimary}
            withOverlay={true}
            pointerColor={'white'}
            toggleOnPress={false}
            triangleOffset={width / 1.325}
            trianglePosition="left"
            popover={
              <Text style={{color: 'white'}}>
                Όταν πατήσεις το κουμπί 'Ξαναπόσταρε' οι πληροφορίες του post θα
                συμπληρωθούν στην αρχική σελίδα έτσι ώστε να μην χρειαστεί να
                τις συμπληρώσεις εσύ.
              </Text>
            }>
            <TopContainerExtraFields
              onCloseContainer={goBack}
              title={'Αγαπημένα post'}
            />
          </Tooltip>
          {!showContent ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 2 - 50,
              }}>
              <Text>Περιμένετε..</Text>
            </View>
          ) : (
            <View style={[styles.container]}>
              <FlatList
                data={dataSource}
                ItemSeparatorComponent={() => <View style={{height: 10}} />}
                keyExtractor={(item, index) => index}
                enableEmptySections={true}
                renderItem={item => {
                  return (
                    <PostLayoutComponent
                      showMenu={true}
                      item={item.item}
                      onMenuClicked={onMenuClicked}
                      isFavoritePostsScreen={true}
                      goToPreviewFavorite={item => {
                        goToCreatePost(item);
                      }}
                      onPress={post => {
                        navigation.navigate(routes.POST_PREVIEW_SCREEN, {
                          showFavoriteIcon: false,
                        });
                        dispatch({
                          type: ADD_ACTIVE_POST,
                          payload: post,
                        });
                      }}
                    />
                  );
                }}
              />

              <OpenImageModal
                isVisible={isModalVisible}
                isPost={true}
                isFavoritePostScreen={true}
                bottomTitle={bottomModalTitle}
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
    </BaseView>
  );
};

export default FavoritePostsScreen;

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
    paddingHorizontal: 4,
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
