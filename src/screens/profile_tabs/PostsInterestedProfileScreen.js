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
} from 'react-native';
import { PostLayoutComponent } from '../../components/PostLayoutComponent';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';

import { routes } from '../../navigation/RouteNames';
import {
  getInterested,
  getInterestedPerUser,
  showInterest,
} from '../../services/MainServices';
import { colors } from '../../utils/Colors';
import { Loader } from '../../utils/Loader';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { ADD_ACTIVE_POST } from '../../actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { setActivePost } from '../../actions/actions';
import { showToast } from '../../utils/Functions';

const PostsInterestedProfileScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const { height } = Dimensions.get('window');
  const myUser = useSelector(state => state.authReducer.user);
  let dispatch = useDispatch();
  let isFocused = useIsFocused();
  const content = useSelector(state => state.contentReducer.content);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params.email)
      getInterestedPerUser({
        email: route.params.email,
        successCallback,
        errorCallback,
      });
  }, []);

  useEffect(() => {
    if (isFocused && route?.params?.postId) {
      let likedPost = dataSource.find(
        item => item.post.postid === route?.params?.postId,
      );
      likedPost.interested = !likedPost.interested;
      dataSource[dataSource.indexOf(likedPost)] = likedPost;
      setDataSource(dataSource);
      setIsRender(!isRender);
      navigation.setParams({ postId: null });
    }
  }, [isFocused]);

  const successCallback = data => {
    setDataSource(data.postUser);
    setTotalPages(data.totalPages);
    setLoading(false);
    setShowPlaceholder(false);
  };
  const errorCallback = () => {
    setLoading(false);
    setShowPlaceholder(false);
  };

  const onProfileClick = email => {
    navigation.push(routes.PROFILE_SCREEN, { email: email, showArrow: true });
  };

  const onLikeClick = (postId, index) => {
    setLoading(true);
    showInterest({
      email: myUser.email,
      postId,
      successCallback: message => {
        setLoading(false);
        let likedPost = dataSource.find(item => item.post.postid === postId);

        likedPost.interested = !likedPost.interested;
        dataSource[index] = likedPost;
        setDataSource(dataSource);
        setIsRender(!isRender);
        showToast(message)
      },
      errorCallback: message => {
        setLoading(false);
        showToast(message)

      },
    });
  };
  const onMenuClicked = (item1, index) => {
    let postToBeDeleted = dataSource.find(
      item => item.post.postid === item1.post.postid,
    );
    setDeletedPost(postToBeDeleted);
    setIsModalVisible(true);
  };


  const onPostPressed = (post) => {

    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: true,
      isPostInterested: true,
    });
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);
  }

  const onActionSheet = index => {
    let newData = dataSource.filter(obj => obj !== deletedPost);
    setDataSource(newData);
    setIsRender(!isRender);

  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 8, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <TopContainerExtraFields
          showArrow
          onCloseContainer={goBack}
          title={content.ridesInterestedIn}
        />

        {showPlaceholder ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height / 2 - 50,
            }}>
            <Text>{content.wait}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <Spacer height={15} />
            <FlatList
              data={dataSource}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              extraData={isRender}
              keyExtractor={(item, index) => 'item' + index}
              //   enableEmptySections={true}
              renderItem={(item, index) => {
                return (
                  <PostLayoutComponent
                    showFavoriteIcon={true}
                    showMenu={false}
                    item={item.item}
                    index
                    onMenuClicked={onMenuClicked}
                    onProfileClick={onProfileClick}
                    onLikeClick={onLikeClick}
                    onPress={onPostPressed}
                  />
                );
              }}
            />
          </View>
        )}

        <OpenImageModal
          isVisible={isModalVisible}
          isPost={true}
          closeAction={() => {
            setIsModalVisible(false);
            setDeletedPost(null);
          }}
          buttonPress={index => {
            setIsModalVisible(false);
            onActionSheet(index);
          }}
        />
        <Loader isLoading={loading} />
      </View>
    </View>
  );
};

export default PostsInterestedProfileScreen;

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
