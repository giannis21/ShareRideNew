import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {
  getAutoComplete,
  getPlaceInfo,
  showInterest,
} from '../services/MainServices';
import {colors} from '../utils/Colors';
import {CustomInput} from '../utils/CustomInput';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Spacer} from '../layout/Spacer';
import {useSelector, useDispatch} from 'react-redux';
import {
  ADD_ACTIVE_POST,
  ADD_MIDDLE_STOP,
  REMOVE_MIDDLE_STOP,
  REMOVE_MIDDLE_STOPS,
} from '../actions/types';
import {PostLayoutComponent} from './PostLayoutComponent';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {useIsFocused} from '@react-navigation/native';
import {routes} from '../navigation/RouteNames';

export function SearchedPostsComponent({
  offset,
  total_pages,
  data,
  navigation,
}) {
  var _ = require('lodash');

  const [value, setValue] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const post = useSelector(state => state.postReducer);
  const myUser = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) setDataSource(data);
  }, [isFocused]);

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
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
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: message => {
        setLoading(false);
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
            setLoading(true);
            getPostsUser({
              email: email,
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
  const onProfileClick = email => {
    navigation.navigate(routes.PROFILE_STACK, {
      screen: routes.PROFILE_SCREEN,
      params: {email},
    });
  };
  return (
    <View
      style={{width: '100%', height: '100%', paddingHorizontal: 8, flex: 1}}>
      <Spacer height={20} />
      <FlatList
        data={dataSource}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        keyExtractor={(item, index) => index}
        extraData={isRender}
        enableEmptySections={true}
        renderItem={item => {
          return (
            <PostLayoutComponent
              showFavoriteIcon={true}
              showMenu={false}
              item={item.item}
              onLikeClick={onLikeClick}
              onProfileClick={onProfileClick}
              onPress={post => {
                navigation.navigate(routes.POST_PREVIEW_SCREEN, {
                  showFavoriteIcon: true,
                });
                dispatch({
                  type: ADD_ACTIVE_POST,
                  payload: post,
                });
              }}
            />
          );
        }}
        ListFooterComponent={renderFooter}
      />
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colorPrimary,
    borderBottomLeftRadius: 54,
    height: 'auto',
    padding: 10,
    marginStart: 6,
  },
  circle: {
    borderRadius: 100 / 2,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  circleContainer1: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  circleContainer2: {
    width: 37,
    height: 37,
    borderRadius: 100 / 2,
    backgroundColor: colors.Gray2,
  },
  maskInputContainer: {
    marginVertical: Platform.OS === 'ios' ? 13 : 20,
    paddingVertical: Platform.OS === 'ios' ? 0 : 20,
    fontSize: 14,
    backgroundColor: 'black',
  },
});
