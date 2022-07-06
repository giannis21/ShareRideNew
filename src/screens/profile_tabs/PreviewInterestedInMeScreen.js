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
  ScrollView,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import { PostLayoutComponent } from '../../components/PostLayoutComponent';
import { BaseView } from '../../layout/BaseView';
import { Spacer } from '../../layout/Spacer';
import { routes } from '../../navigation/RouteNames';
import {
  addActivePost,
  getInterestedPerPost,
  getPostPerId,
  verInterested,
} from '../../services/MainServices';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Loader } from '../../utils/Loader';
import { useIsFocused } from '@react-navigation/native';
import { TopContainerExtraFields } from '../../components/TopContainerExtraFields';
import { useSelector, useDispatch } from 'react-redux';
import { UserComponent } from '../../components/UserComponent';
import { HorizontalLine } from '../../components/HorizontalLine';
import { setActivePost } from '../../actions/actions';
import { CommonStyles } from '../../layout/CommonStyles';
import { showToast } from '../../utils/Functions';

const PreviewInterestedInMeScreen = ({ navigation, route }) => {
  var _ = require('lodash');
  const { footer, footerBtnText, loadMoreBtn } = CommonStyles;
  const post = useSelector(state => state.postReducer.activePost);
  const content = useSelector(state => state.contentReducer.content);

  const [total_pages, setTotalPages] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isRender, setIsRender] = useState(false);
  const [waitMsg, setWaitMsg] = useState(content.wait)


  let dispatch = useDispatch();
  let isFocused = useIsFocused();

  useEffect(() => {
    if (route.params?.isDeepLink) {
      dispatch(getPostPerId(route.params?.postId));
    }
  }, []);

  useEffect(() => {
    if (post?.post) getUsers();
  }, [post?.post]);

  const handleBackButtonClick = async () => {
    dispatch(addActivePost({}));
    navigation.goBack();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, []),
  );

  const onProfileClick = email => {
    //when im in profile and receive a notification
    //i want to push the navigation to the stack and not navigate
    //if i am not, this will crash, so it will navigate normally
    try {
      navigation.push(routes.PROFILE_SCREEN, { email, showArrow: true });
    } catch (err) {
      navigation.navigate(routes.PROFILE_SCREEN, { email, showArrow: true });
    }
  };
  const getUsers = () => {
    getInterestedPerPost({
      postId: post.post.postid,
      page: offset,
      successCallback,
      errorCallback,
    });
  };

  const successCallback = data => {

    setIsLoading(false);
    setDataSource([...dataSource, ...data.users]);
    setTotalPages(data.totalPages);
    setOffset(offset + 1);
    setIsLoading(false);
  };

  const errorCallback = () => {
    setWaitMsg(content.userNotFound)
    setIsLoading(false);
  };

  const onMenuClicked = (item1, index) => {
    let postToBeDeleted = dataSource.find(
      item => item.post.postid === item1.post.postid,
    );
    setDeletedPost(postToBeDeleted);
    setIsModalVisible(true);
  };

  const giveApproval = (piid, isVerified) => {
    let tempList = dataSource;

    let updatedIndex = dataSource.findIndex(obj => obj.piid === piid);
    let updated = dataSource.find(obj => obj.piid === piid);
    updated.isVerified = null;
    tempList[updatedIndex] = updated;
    setDataSource(tempList);
    setIsRender(!isRender);
    verInterested({
      postid: post.post.postid,
      piid: piid,
      successCallback: message => {
        let tempList = [...dataSource];

        updated.isVerified = !isVerified;
        tempList[updatedIndex] = updated;

        setDataSource(tempList);
        setIsRender(!isRender);
        setIsLoading(false);
        showToast(message)
      },
      errorCallback: message => {
        let tempList = dataSource;

        updated.isVerified = isVerified;
        tempList[updatedIndex] = updated;

        setDataSource(tempList);
        setIsRender(!isRender);

        showToast(message, false)
        setIsLoading(false);

      },
    });
  };

  const renderFooter = () => {
    return !_.isEmpty(dataSource) && offset <= total_pages ? (
      <View style={footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setIsLoading(true);
            getUsers();
          }}
          style={loadMoreBtn}>
          <Text style={footerBtnText}>{content.loadMore}</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const goToPostPreview = () => {
    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: false,
      resetActivePost: true
    });
  };

  const onPostPressed = post => {
    goToPostPreview();
    setTimeout(() => {
      dispatch(setActivePost(post));
    }, 0);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 8, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <TopContainerExtraFields
          showArrow={!route.params?.isDeepLink}
          onCloseContainer={() => {
            navigation.goBack();
          }}
          title={content.rideInterested}
        />
        {post && (
          <View>
            <PostLayoutComponent
              showMenu={false}
              item={post}
              onPress={onPostPressed}
              onMenuClicked={onMenuClicked}
            />
            <HorizontalLine containerStyle={{ height: 4, marginVertical: 10 }} />
          </View>

        )}


        {!_.isEmpty(dataSource) ? (
          <FlatList
            data={dataSource}
            extraData={isRender}
            keyExtractor={(item, index) => index}
            renderItem={(item, index) => {
              return (
                <UserComponent
                  user={item.item}
                  index={index}
                  onProfileClick={onProfileClick}
                  giveApproval={giveApproval}
                  fillWidth
                />
              );
            }}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 110,
            }}>
            <Text>{waitMsg}</Text>
          </View>
        )}

        <Loader isLoading={isFocused ? isLoading : false} />
      </View>

    </View>
  );
};

export default PreviewInterestedInMeScreen;

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    top: 0,
  },
  container: {
    flex: 1,
  },
});
