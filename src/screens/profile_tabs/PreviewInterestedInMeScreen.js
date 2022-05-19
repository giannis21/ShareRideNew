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
  ScrollView,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import {PostLayoutComponent} from '../../components/PostLayoutComponent';
import {BaseView} from '../../layout/BaseView';
import {Spacer} from '../../layout/Spacer';
import {routes} from '../../navigation/RouteNames';
import {
  deleteInterested,
  deletePost,
  getInterestedPerPost,
  getPostsUser,
  verInterested,
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
import {PictureComponent} from '../../components/PictureComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import {useSelector, useDispatch} from 'react-redux';
import {BASE_URL} from '../../constants/Constants';
import {UserComponent} from '../../components/UserComponent';
import {ADD_ACTIVE_POST, DELETE_ACTIVE_USER} from '../../actions/types';
const PreviewInterestedInMeScreen = ({navigation, route}) => {
  var _ = require('lodash');
  const [total_pages, setTotalPages] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deletedPost, setDeletedPost] = useState(null);
  const [isRender, setIsRender] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [showContent, setShowContent] = React.useState(true);
  const {height, width} = Dimensions.get('window');

  const post = useSelector(state => state.postReducer.activePost);
  let dispatch = useDispatch();
  let isFocused = useIsFocused();

  useEffect(() => {
    getUsers();
  }, []);

  const handleBackButtonClick = async () => {
    dispatch({
      type: ADD_ACTIVE_POST,
      payload: {},
    });
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
    navigation.push(routes.PROFILE_SCREEN, {email, showArrow: true});
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
    setIsLoading(false);
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
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  const deleteInterested1 = piid => {
    try {
      deleteInterested({
        piid: piid,
        successCallback: message => {
          let newData = dataSource.filter(obj => obj.piid !== piid);
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
    } catch (err) {}
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
        let tempList = dataSource;

        updated.isVerified = !isVerified;
        tempList[updatedIndex] = updated;

        setDataSource(tempList);
        setIsRender(!isRender);

        setInfoMessage({info: message, success: true});
        setIsLoading(false);
        showCustomLayout();
      },
      errorCallback: message => {
        let tempList = dataSource;

        updated.isVerified = isVerified;
        tempList[updatedIndex] = updated;

        setDataSource(tempList);
        setIsRender(!isRender);

        setInfoMessage({info: message, success: false});
        setIsLoading(false);
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
            getUsers();
          }}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Φόρτωσε Περισσότερα...</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  const {userStyleAdded} = styles;
  return (
    <View style={{flex: 1, paddingHorizontal: 8, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <TopContainerExtraFields
          showArrow
          onCloseContainer={() => {
            navigation.goBack();
          }}
          title={'Ενδιαφερόμενοι του Ride'}
        />
        {post && (
          <PostLayoutComponent
            showMenu={false}
            item={post}
            onPress={post => {
              navigation.navigate(routes.POST_PREVIEW_SCREEN, {
                showFavoriteIcon: false,
              });
              dispatch({
                type: ADD_ACTIVE_POST,
                payload: post,
              });
            }}
            onMenuClicked={onMenuClicked}
          />
        )}
        <View
          style={{
            width: '100%',
            backgroundColor: colors.CoolGray1.toString(),
            height: 4,
            marginVertical: 10,
          }}
        />

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
                  deleteInterested={deleteInterested1}
                  giveApproval={giveApproval}
                  fillWidth
                />
              );
            }}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 110,
              }}>
              <Text>Περιμένετε..</Text>
            </View>
          </View>
        )}

        <Loader isLoading={isFocused ? isLoading : false} />
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

export default PreviewInterestedInMeScreen;

const styles = StyleSheet.create({
  timer: {
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  userStyleAdded: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c5dde3',
    alignSelf: 'baseline',
    width: 'auto',
    borderRadius: 13,
    marginEnd: 10,
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
