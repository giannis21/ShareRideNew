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
  searchForPosts,
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
  SET_SEARCH_POSTID_MODIFIED,
} from '../actions/types';
import {PostLayoutComponent} from './PostLayoutComponent';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {useIsFocused} from '@react-navigation/native';
import {routes} from '../navigation/RouteNames';
import {Loader} from '../utils/Loader';
import {filterKeys, getValue} from '../utils/Storage';
import {
  getCar,
  getEndAge,
  getEndDate,
  getGender,
  getPetAllowed,
  getReturnEndDate,
  getReturnStartDate,
  getStartAge,
  getStartDate,
  hasReturnDate,
} from '../screens/main_flow/search_route/searchRouteFunctions';

export function SearchedPostsComponent({
  total_pages,
  data,
  navigation,
  placesObj,
  route,
}) {
  var _ = require('lodash');
  const [offset, setOffset] = useState(2);
  const [dataSource, setDataSource] = useState(data);
  const [isRender, setIsRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const post = useSelector(state => state.postReducer);
  const myUser = useSelector(state => state.authReducer.user);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const generalReducer = useSelector(state => state.generalReducer);

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };

  useEffect(() => {
    if (isFocused && generalReducer.searchedPostIdToModified !== null) {
      console.log(
        ' generalReducer.searchedPostIdToModified,',
        generalReducer.searchedPostIdToModified,
      );
      let likedPost = dataSource.find(
        item => item.post.postid === generalReducer.searchedPostIdToModified,
      );
      likedPost.interested = !likedPost.interested;
      dataSource[dataSource.indexOf(likedPost)] = likedPost;
      setDataSource(dataSource);
      setIsRender(!isRender);
      dispatch({type: SET_SEARCH_POSTID_MODIFIED, payload: null});
    }
  }, [isFocused, generalReducer.searchedPostIdToModified]);

  const searchPosts = async () => {
    let sendObj = {
      data: {
        email: myUser.email,
        startplace: placesObj.startplace,
        startcoord: placesObj.startcoord,
        endplace: placesObj.endplace,
        endcoord: placesObj.endcoord,
        startdate: await getStartDate(),
        enddate: await getEndDate(),
        page: offset,
        cost: (await getValue(filterKeys.maxCost)) ?? '100',
        age: await getStartAge(),
        age_end: await getEndAge(),
        car: await getCar(),
        cardate: (await getValue(filterKeys.carAge)) ?? '2000',
        gender: await getGender(),
        withReturn: await hasReturnDate(),
        petAllowed: await getPetAllowed(),
        returnStartDate: await getReturnStartDate(),
        returnEndDate: await getReturnEndDate(),
      },
    };

    setIsLoading(true);
    searchForPosts({
      sendObj,
      successCallback: data => {
        setIsLoading(false);
        setDataSource([...dataSource, ...data.body.postUser]);
        setOffset(offset + 1);
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  const onLikeClick = (postId, index) => {
    setIsLoading(true);
    showInterest({
      email: myUser.email,
      postId,
      successCallback: message => {
        setIsLoading(false);
        let likedPost = dataSource.find(item => item.post.postid === postId);

        likedPost.interested = !likedPost.interested;
        dataSource[index] = likedPost;
        setDataSource(dataSource);
        setIsRender(!isRender);
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
            searchPosts();
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
      <Loader isLoading={isLoading} />
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
                  isSearchedPost: true,
                  showCloseIcon: true,
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
