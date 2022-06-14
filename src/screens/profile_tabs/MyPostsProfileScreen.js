import React, { useState, useEffect, useCallback } from 'react';
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
import { PostLayoutComponent } from '../../components/PostLayoutComponent';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';
import { routes } from '../../navigation/RouteNames';
import {
  addRemovePostToFavorites,
  deletePost,
  getFavoritePosts,
  getPostsUser,
} from '../../services/MainServices';
import { colors } from '../../utils/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { Loader } from '../../utils/Loader';
import { useIsFocused } from '@react-navigation/native';
import { InfoPopupModal } from '../../utils/InfoPopupModal';
import { constVar } from '../../utils/constStr';
import { CustomInfoLayout } from '../../utils/CustomInfoLayout';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { useDispatch, useSelector } from 'react-redux';
import { CommonStyles } from '../../layout/CommonStyles';
import { setActivePost } from '../../actions/actions';

const MyPostsProfileScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [isRender, setIsRender] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ info: '', success: false });

  const { loadMoreBtn, footerBtnText, footer } = CommonStyles;

  let dispatch = useDispatch();
  const myUser = useSelector(state => state.authReducer.user);
  const content = useSelector(state => state.contentReducer.content);

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
    setShowPlaceholder(false)
  };
  const errorCallback = () => {
    setIsLoading(false);
    setShowPlaceholder(false)
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  const onMenuClicked = (item1, index) => {
    let postToBeDeleted = dataSource.find(
      item => item.post.postid === item1.post.postid,
    );
    setDeletedPost(postToBeDeleted);
    setIsModalVisible(true);
  };

  const onActionSheet = index => {
    setTimeout(() => {
      setIsLoading(true);
    }, 600);

    switch (index) {
      case 2: {
        deletePost({
          postID: deletedPost.post.postid,
          successCallback: message => {
            dispatch(getFavoritePosts());
            let newData = dataSource.filter(obj => obj !== deletedPost);
            setDataSource(newData);
            setIsRender(!isRender);

            setInfoMessage({ info: message, success: true });
            setIsLoading(false);
            showCustomLayout();
          },
          errorCallback: message => {
            setInfoMessage({ info: message, success: false });
            setIsLoading(false);
            showCustomLayout();
          },
        });
        break;
      }
      default: {
        addRemovePostToFavorites({
          postid: deletedPost.post.postid,
          successCallback: message => {
            setTimeout(() => {
              setIsLoading(false);
            }, 600);

            dispatch(getFavoritePosts());
            setInfoMessage({ info: message, success: true });
            showCustomLayout();
          },
          errorCallback: message => {
            setIsLoading(false);
            setInfoMessage({ info: message, success: false });
            showCustomLayout();
          },
        });
      }
    }
  };

  const onFooterPressed = () => {
    setIsLoading(true);
    getPostsUser({
      email: myUser.email,
      page: offset,
      successCallback,
      errorCallback,
    });
  };
  const renderFooter = () => {
    return !_.isEmpty(dataSource) && offset <= total_pages ? (
      <View style={footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onFooterPressed}
          style={loadMoreBtn}>
          <Text style={footerBtnText}>{content.loadMore}</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const goToPostScreen = () => {
    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: false,
      showCloseArrow: true,
    });
  };
  const goToPreviewScreen = () => {
    navigation.navigate(routes.PREVIEW_INTERESTED_IN_ME_SCREEN);
  };

  const onShowMoreUsers = post => {
    goToPreviewScreen();
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);
  };

  const onPostPressed = post => {
    goToPostScreen();
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);


  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 8, backgroundColor: 'white' }}>
      <TopContainerExtraFields
        showArrow
        onCloseContainer={goBack}
        title={content.myRides}
      />
      <Loader isLoading={isLoading} />
      {showPlaceholder ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimensions.get('screen').height / 2 - 50,
          }}>
          <Text>{content.wait}</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={dataSource}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
                  showMoreUsers={onShowMoreUsers}
                  onPress={onPostPressed}
                />
              );
            }}
            ListFooterComponent={renderFooter}
          />

          <OpenImageModal
            postId={deletedPost?.post?.postid}
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
        </View>)}

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
  container: {
    flex: 1,
  },
});
