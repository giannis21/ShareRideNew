import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import { BaseView } from '../../../layout/BaseView';
import { routes } from '../../../navigation/RouteNames';
import {
  getFavoritePosts,
  getPlaceInfo,
  getUsersToRate,
  searchForPosts,
} from '../../../services/MainServices';
import { colors } from '../../../utils/Colors';
import { Loader } from '../../../utils/Loader';
import { MainHeader } from '../../../utils/MainHeader';
import { filterKeys, getValue, keyNames, setValue } from '../../../utils/Storage';
import { BackHandler } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SearchLocationComponent } from '../../../components/SearchLocationComponent';
import {
  ADD_SEARCH_END_POINT,
  ADD_SEARCH_START_POINT,
} from '../../../actions/types';

import { SearchedPostsComponent } from '../../../components/SearchedPostsComponent';
import { InfoPopupModal } from '../../../utils/InfoPopupModal';
import { SearchScreenComponent } from '../../../components/SearchScreenComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FavDestComponent } from '../../../components/FavDestComponent';
import {
  createTable,
  getDBConnection,
  getFavorites,
} from '../../../database/db-service';
import SearchTopTabBar from '../../../components/SearchTopTabBar';
import { NotificationsModal } from '../../../utils/NotificationsModal';
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
} from './searchRouteFunctions';

import { getFavoriteRoutes } from '../../../customSelectors/SearchSelectors';
import {
  hideBottomTab,
  setActiveNotification,
  setFavoriteRoutes,
} from '../../../actions/actions';
import { showToast } from '../../../utils/Functions';


let searchObj = null;
const SearchRouteScreen = ({ navigation, route }) => {
  var _ = require('lodash');

  const [isLoading, setIsLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState({ from: true, open: false });
  const [openSearchedPost, setOpenSearchedPosts] = useState(false);
  const [total_pages, setTotalPages] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);
  const [carouselItem, setCarouselItem] = useState(null);
  const [notificationsModalOpen, setNotificationModalOpen] = useState(false);

  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);
  const searchReducer = useSelector(state => state.searchReducer);
  const generalReducer = useSelector(state => state.generalReducer);
  const content = useSelector(state => state.contentReducer.content);
  let favoriteRoutes = useSelector(getFavoriteRoutes());
  const dispatch = useDispatch();
  const Tab = createMaterialTopTabNavigator();

  //following api calls need to be called only once per login
  useEffect(() => {
    dispatch(getFavoritePosts());
    dispatch(getUsersToRate());
  }, [myUser.email]);

  useEffect(() => {
    loadFavoriteRoutes();
  }, [searchReducer.triggerDatabase, myUser.email]);

  useEffect(() => {
    if (generalReducer.hasActiveNotification) {
      dispatch(setActiveNotification(false));

      if (generalReducer?.notificationObject.data.type === 'receiveInterest') {
        goToPreviewInterested(generalReducer?.notificationObject.data.postid)
      } else if (generalReducer?.notificationObject.data.type === 'newRide') {
        goToPostPreview(generalReducer?.notificationObject.data.postid)
      } else if (generalReducer?.notificationObject.data.type === 'receiveApproval') {
        goToProfile(generalReducer?.notificationObject.data.email)
      }


    }
  }, [generalReducer.hasActiveNotification]);

  const goToProfile = (email) => {

    try {
      navigation.navigate(routes.PROFILE_STACK, {
        screen: routes.PROFILE_SCREEN,
        params: { email, isDeepLink: true },
      });
    } catch (err) {
      navigation.push(routes.PROFILE_STACK, {
        screen: routes.PROFILE_SCREEN,
        params: { email, isDeepLink: true },
      });
    }
  };

  const goToPreviewInterested = (postId) => {

    navigation.push(routes.PROFILE_STACK, {
      screen: routes.PREVIEW_INTERESTED_IN_ME_SCREEN,
      params: { isDeepLink: true, postId: postId },
    });
  };

  const goToPostPreview = () => {
    navigation.navigate(routes.POST_PREVIEW_SCREEN, {
      showFavoriteIcon: true,
      isDeepLink: true,
      showCloseIcon: true,
    });
  };

  const loadFavoriteRoutes = async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      getFavorites(myUser.email, db).then(data => {
        if (data.length) {
          dispatch(setFavoriteRoutes(data));
        } else {
          dispatch(setFavoriteRoutes([]));
        }
      });
    } catch (error) {
      dispatch(setFavoriteRoutes([]));
    }
  };

  useEffect(() => {
    if (openSearch.open || openSearchedPost) {
      dispatch(hideBottomTab(true));
    } else {
      dispatch(hideBottomTab(false));
    }
  }, [openSearch.open, openSearchedPost]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, [openSearch.open, openSearchedPost]),
  );

  const getStartPlace = () => {
    return lastActiveIndex === 0 && showTabs()
      ? carouselItem?.startplace
      : post.searchStartplace;
  };

  const getStartCoord = () => {
    return lastActiveIndex === 0 && showTabs()
      ? carouselItem?.startcoord
      : post.searchStartcoord;
  };

  const getEndPlace = () => {
    return lastActiveIndex === 0 && showTabs()
      ? carouselItem?.endplace
      : post.searchEndplace;
  };
  const getEndCoord = () => {
    return lastActiveIndex === 0 && showTabs()
      ? carouselItem?.endcoord
      : post.searchEndcoord;
  };
  const getcarBrand = (car) => {
    if (car === "ΟΛΑ" || car === 'ALL' || car === "All") {
      return null
    }
    return car
  }
  const searchPosts = async () => {

    searchObj = {
      data: {
        email: myUser.email,
        startplace: getStartPlace(),
        startcoord: getStartCoord(),
        endplace: getEndPlace(),
        endcoord: getEndCoord(),
        startdate: await getStartDate(),
        enddate: await getEndDate(),
        page: 1,
        cost: (await getValue(filterKeys.maxCost)) ?? '100',
        age: await getStartAge(),
        age_end: await getEndAge(),
        car: getcarBrand(await getCar(content.all1)),
        cardate: (await getValue(filterKeys.carAge)) ?? '2000',
        gender: await getGender(content),
        withReturn: await hasReturnDate(),
        petAllowed: await getPetAllowed(),
        returnStartDate: await getReturnStartDate(),
        returnEndDate: await getReturnEndDate(),
      },
    };
    console.log({ searchObj })
    setIsLoading(true);
    searchForPosts({
      sendObj: searchObj,
      successCallback: data => {
        setIsLoading(false);
        setDataSource(data.body.postUser);
        setTotalPages(data.body.totalPages);
        setOpenSearchedPosts(true);
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        showToast(errorMessage, false)
      },
    });
  };

  const handleBackButtonClick = async () => {
    if (openSearch.open) {
      setOpenSearch({ from: true, open: false });
    } else if (openSearchedPost) {
      resetArray();
      setOpenSearchedPosts(false);
    } else {
      setModalCloseVisible(true);
    }
    return true;
  };

  let resetArray = () => {
    setDataSource([]);
    setOpenSearchedPosts(false);
    searchObj = null;
  };

  const getPlace = (place_id, place, isStartPoint) => {
    getPlaceInfo({
      place_id,
      successCallback: coordinates => {
        if (openSearch.from !== true && post.searchStartcoord === coordinates) {
          showToast(content.destAlreadyAddedAsInitial, false)
          return;
        }

        if (openSearch.from === true && post.searchEndcoord === coordinates) {
          showToast(content.destAlreadyAddedAsFinal, false)
          return;
        }

        dispatch({
          type: getType(isStartPoint),
          payload: [place, coordinates],
        });
      },
      errorCallback: () => { },
    });
  };

  function getType(isStartPoint) {
    return isStartPoint ? ADD_SEARCH_START_POINT : ADD_SEARCH_END_POINT;
  }


  const showTabs = () => {
    return (
      !openSearch.open &&
      !openSearchedPost &&
      searchReducer.favoriteRoutes?.length > 0
    );
  };

  const { tabsStyle } = styles;

  return (
    <BaseView
      showStatusBar={true}
      statusBarColor={colors.colorPrimary}
      removePadding>
      <Loader isLoading={isLoading} />
      <MainHeader
        onClose={() => {
          openSearchedPost
            ? resetArray()
            : setOpenSearch({ from: true, open: false });
        }}
        title={content.searchRide}
        showX={openSearch.open === true || openSearchedPost === true}
        onSettingsPress={() => {
          navigation.navigate(routes.SETTINGS_SCREEN, { email: myUser.email });
        }}
        onFilterPress={() => {
          navigation.navigate(routes.FILTERS_SCREEN);
        }}
        onNotificationPress={() => {
          setNotificationModalOpen(true);
        }}
        onFavoritePostsPress={() => {
          navigation.navigate(routes.FAVORITE_POSTS_SCREEN);
        }}
      />

      {showTabs() && (
        <View style={tabsStyle}>
          <Tab.Navigator
            tabBar={props => (
              <SearchTopTabBar
                {...props}
                tabBarLabelStyle={true}
                isSearchOpen={openSearch.open}
                lastActiveIndex={lastActiveIndex}
                onChangeIndex={activeIndex => {
                  setLastActiveIndex(activeIndex);
                }}
              />
            )}
            screenOptions={{
              tabBarLabelStyle: { textTransform: 'lowercase' },
              tabBarScrollEnabled: true,
              tabStyle: {
                width: '100%',
              },
            }}>
            <Tab.Screen name={content.favoritesTab}>
              {props => (
                <FavDestComponent
                  onSearchPosts={searchPosts}
                  onCarouselItemChange={currentCarouselItem =>
                    setCarouselItem(currentCarouselItem)
                  }
                />
              )}
            </Tab.Screen>

            <Tab.Screen name={content.searchBottomTab}>
              {props => (
                <SearchScreenComponent
                  navigation
                  onSearchPosts={() => {
                    searchPosts();
                  }}
                  onOpenSearch={(from, open) => {
                    setOpenSearch({ from: from, open: open });
                  }}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      )}

      {!openSearch.open && _.isEmpty(dataSource) && _.isEmpty(favoriteRoutes) && (
        <SearchScreenComponent
          navigation
          onSearchPosts={() => {
            searchPosts();
          }}
          onOpenSearch={(from, open) => {
            setOpenSearch({ from: from, open: open });
          }}
        />
      )}

      {openSearchedPost && !_.isEmpty(dataSource) && (
        <SearchedPostsComponent
          navigation={navigation}
          route={route}
          placesObj={{
            startplace: searchObj?.data.startplace,
            startcoord: searchObj?.data.startcoord,
            endplace: searchObj?.data.endplace,
            endcoord: searchObj?.data.endcoord,
          }}
          data={dataSource}
          total_pages={total_pages}
        />
      )}

      {openSearch.open && (
        <SearchLocationComponent
          from={openSearch.from}
          onPress={(place_id, place, isStartPoint) => {
            getPlace(place_id, place, isStartPoint);
            setOpenSearch({ from: true, open: false });
          }}
        />
      )}


      <InfoPopupModal
        preventAction={true}
        preventActionText={content.exit}
        isVisible={modalCloseVisible}
        description={content.closeAppAsk}
        buttonText={content.noC}
        closeAction={() => {
          setModalCloseVisible(false);
        }}
        buttonPress={() => {
          BackHandler.exitApp();
        }}
        descrStyle={true}
      />
      <NotificationsModal
        onSubmit={(rating, text) => { }}
        isVisible={notificationsModalOpen}
        onProfileClick={(email, toEdit) => {
          setNotificationModalOpen(false);
          navigation.navigate(routes.PROFILE_STACK, {
            screen: routes.PROFILE_SCREEN,
            params: { email: email },
          });
        }}
        closeAction={() => {
          setNotificationModalOpen(false);
        }}
      />
    </BaseView>
  );
};

export default SearchRouteScreen;

const styles = StyleSheet.create({
  tabsStyle: {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    height: '100%',
  },
});
