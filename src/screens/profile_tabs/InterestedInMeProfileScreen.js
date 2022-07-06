import React, { useState, useEffect } from 'react';
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
import { Spacer } from '../../layout/Spacer';
import { routes } from '../../navigation/RouteNames';
import {
  deletePost,
  getFavoritePosts,
  getInterestedInMe,
} from '../../services/MainServices';
import { colors } from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { OpenImageModal } from '../../utils/OpenImageModal';
import { Loader } from '../../utils/Loader';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { setActivePost } from '../../actions/actions';
import { showToast } from '../../utils/Functions';

const InterestedInMeProfileScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(1);
  const [email1, setEmail] = useState(route.params.email);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [isRender, setIsRender] = useState(false);

  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const { height } = Dimensions.get('window');
  let navigation1 = useNavigation();
  let isFocused = useIsFocused();
  const dispatch = useDispatch();
  const myUser = useSelector(state => state.authReducer.user);
  //const users = useSelector(state => state.postReducer.activePost.users)
  useEffect(() => {
    setIsLoading(false);

    getInterestedInMe({
      email: email1,
      page: offset,
      successCallback,
      errorCallback,
    });

    if (!isFocused) {
      setOffset(1);
    }
  }, [isFocused]);

  const goBack = () => {
    navigation.goBack();
  };

  const successCallback = data => {
    setIsLoading(false);
    setDataSource([...dataSource, ...data.postUser]);
    setTotalPages(data.totalPages);
    setOffset(offset + 1);
    setIsLoading(false);
    setShowPlaceholder(false);
  };
  const errorCallback = () => {
    setIsLoading(false);
    setShowPlaceholder(false);
  };


  const onProfileClick = email => {
    navigation1.push(routes.PROFILE_SCREEN, { email: email });
  };
  const onMenuClicked = (item1, index) => {
    let postToBeDeleted = dataSource.find(
      item => item.post.postid === item1.post.postid,
    );
    setDeletedPost(postToBeDeleted);
    setIsModalVisible(true);
  };

  const deleteInterested = (fullname, postid) => {
    try {
      // let postToBeDeleted = dataSource.find((item) => item?.post?.postid === postid)
      // let deletedUser = postToBeDeleted?.users.find((user) => user.fullname === fullname)
      // let updatedPostList = postToBeDeleted.users.filter((obj) => obj !== deletedUser)
      // let index = dataSource.indexOf(postToBeDeleted);
      // let tempData = dataSource
      // if (index > 0) {
      //     tempData[index] = updatedPostList
      //     setDataSource(tempData)
      //     setIsRender(!isRender)
      // }
    } catch (err) { }
  };
  const onActionSheet = index => {
    setIsLoading(true);

    deletePost({
      postID: deletedPost.post.postid,
      successCallback: message => {
        dispatch(getFavoritePosts());
        let newData = dataSource.filter(obj => obj !== deletedPost);
        setDataSource(newData);
        setIsRender(!isRender);

        setIsLoading(false);
        showToast(message)
      },
      errorCallback: message => {
        setIsLoading(false);
        showToast(message, false)
      },
    });
  };

  const renderFooter = () => {
    return offset <= total_pages && !_.isEmpty(dataSource) ? (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setIsLoading(true);
            getInterestedInMe({
              email: email,
              page: offset,
              successCallback,
              errorCallback,
            });
          }}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{content.loadMore}</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const goToPostScreen = () => {
    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: false,
    });
  };
  const onPostPressed = post => {
    goToPostScreen();
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);

  };

  const goToPreviewInterested = () => {
    navigation1.navigate(routes.PREVIEW_INTERESTED_IN_ME_SCREEN);
  };

  const onShowMoreUsers = post => {
    goToPreviewInterested();
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 8 }}>
      <View style={styles.container}>
        <TopContainerExtraFields
          showArrow
          onCloseContainer={goBack}
          title={'Ενδιαφερόμενοι'}
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
              initialNumToRender={5}
              removeClippedSubviews={true}
              data={dataSource}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyExtractor={(item, index) => index}
              enableEmptySections={true}
              renderItem={(item, index) => {
                return (
                  <PostLayoutComponent
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
            <Loader isLoading={isFocused ? isLoading : false} />
          </View>
        )}
      </View>

    </View>
  );
};

export default InterestedInMeProfileScreen;

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
