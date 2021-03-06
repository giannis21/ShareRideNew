import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
} from 'react-native';
import { PostLayoutComponent } from '../../components/PostLayoutComponent';
import { Spacer } from '../../layout/Spacer';
import { routes } from '../../navigation/RouteNames';
import {
  addRemovePostToFavorites,
  deletePost,
  getFavoritePosts,
  getPostsUser,
} from '../../services/MainServices';
import { colors } from '../../utils/Colors';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { Loader } from '../../utils/Loader';
import { useIsFocused } from '@react-navigation/native';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { useDispatch, useSelector } from 'react-redux';
import { SET_POST_SCREEN_VALUES } from '../../actions/types';
import { BaseView } from '../../layout/BaseView';
import Tooltip from '../../components/tooltip/Tooltip';
import { getValue, keyNames, setValue } from '../../utils/Storage';
import { setActivePost } from '../../actions/actions';
import { showToast } from '../../utils/Functions';

const FavoritePostsScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [isRender, setIsRender] = useState(false);
  const [bottomModalTitle, setBottomModalTitle] = React.useState(null);
  const { height, width } = Dimensions.get('window');

  let isFocused = useIsFocused();
  let dispatch = useDispatch();
  const tooltipRef = useRef();

  const post = useSelector(state => state.postReducer);
  const content = useSelector(state => state.contentReducer.content);



  useEffect(() => {
    setDataSource(post.favoritePosts);
  }, [post.favoritePosts.length]);

  useEffect(() => {
    if (isFocused) toggleTooltip();
  }, [isFocused]);

  const toggleTooltip = async (delay = 1000) => {
    let isFirstTime = await getValue(keyNames.favoritePostsBannerShown);

    setTimeout(() => {
      setValue(keyNames.favoritePostsBannerShown, 'false');
      if (isFirstTime === undefined && isFocused) {
        tooltipRef?.current?.toggleTooltip();
      }
    }, delay);
  };

  const goBack = () => {
    navigation.goBack();
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

          showToast(message)
          setIsLoading(false);

        },
        errorCallback: message => {
          setIsLoading(false);
          showToast(message, false)
        },
      });
      return;
    }

    deletePost({
      postID: deletedPost.post.postid,
      successCallback: message => {
        dispatch(getFavoritePosts());
        setIsLoading(false);
        showToast(message)
      },
      errorCallback: message => {
        setIsLoading(false);
        showToast(message, false)
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

    navigation.navigate('create', {
      screen: routes.CREATE_POST_SCREEN,
      params: {
        comment: item.post.comment,
        cost: item.post.costperseat,
        seats: item.post.numseats,
        petAllowed: item.post.petAllowed,
      },
    });
  };
  const onPostPressed = post => {

    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: false,
      showCloseIcon: true,
    });
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);

  };

  return (

    <BaseView
      removePadding
      showStatusBar={Platform.OS === 'android' ? true : false}
      containerStyle={{ flex: 1 }}
      statusBarColor={'black'}>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          paddingBottom: Platform.OS === 'android' ? 65 : 2,
          paddingHorizontal: 4,
        }}>
        <Tooltip
          skipAndroidStatusBar={true}
          disabled={true}
          ref={tooltipRef}
          width={width / 1.2}
          height={100}
          backgroundColor={colors.colorPrimary}
          withOverlay={false}
          pointerColor={'transparent'}
          toggleOnPress={false}
          triangleOffset={width / 1.325}
          trianglePosition="left"
          popover={
            <Text style={{ color: 'white' }}>

              {content.tooltipFavorites}

            </Text>
          }>
          <TopContainerExtraFields
            showInfoIcon
            onCloseContainer={goBack}
            title={content.favoriteRides}
            onEndIconPress={() => {
              tooltipRef?.current?.toggleTooltip();
            }}
          />
        </Tooltip>

        <View>
          <FlatList
            data={dataSource}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            keyExtractor={(item, index) => index}
            enableEmptySections={true}
            renderItem={item => {
              return (
                <PostLayoutComponent
                  showMenu={true}
                  item={item.item}
                  onMenuClicked={onMenuClicked}
                  isFavoritePostsScreen={true}
                  goToPreviewFavorite={goToCreatePost}
                  onPress={onPostPressed}
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
  container: {},
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
