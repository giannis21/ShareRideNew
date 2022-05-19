import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import {BaseView} from '../../../layout/BaseView';
import {routes} from '../../../navigation/RouteNames';
import {
  createRequest,
  getFavoritePosts,
  getPlaceInfo,
  getRequests,
  getRequests2,
  getTerms,
  getUsersToRate,
  resetValues,
  searchForPosts,
} from '../../../services/MainServices';
import {colors} from '../../../utils/Colors';
import {Loader} from '../../../utils/Loader';
import {MainHeader} from '../../../utils/MainHeader';
import {filterKeys, getValue, keyNames, setValue} from '../../../utils/Storage';
import {BackHandler} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SearchLocationComponent} from '../../../components/SearchLocationComponent';
import {FiltersModal} from '../../../utils/FiltersModal';
import {constVar} from '../../../utils/constStr';
import {
  ADD_SEARCH_END_POINT,
  ADD_SEARCH_START_POINT,
  CLEAR_SEARCH_VALUES,
  GET_FAVORITE_ROUTES,
  GET_REQUESTS,
  HIDE_BOTTOM_TAB,
  SET_PROFILE_PHOTO,
} from '../../../actions/types';
import {SelectLocationComponent} from '../../../components/SelectLocationComponent';
import {Spacer} from '../../../layout/Spacer';
import {RoundButton} from '../../../Buttons/RoundButton';
import {SearchedPostsComponent} from '../../../components/SearchedPostsComponent';
import {CustomInfoLayout} from '../../../utils/CustomInfoLayout';
import moment from 'moment';
import {usePreventGoBack} from '../../../customHooks/usePreventGoBack';
import {InfoPopupModal} from '../../../utils/InfoPopupModal';
import {SearchScreenComponent} from '../../../components/SearchScreenComponent';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {FavDestComponent} from '../../../components/FavDestComponent';
import {
  createTable,
  getDBConnection,
  getFavorites,
} from '../../../database/db-service';
import SearchTopTabBar from '../../../components/SearchTopTabBar';
import RNFetchBlob from 'rn-fetch-blob';
import FastImage from 'react-native-fast-image';
import {NotificationsModal} from '../../../utils/NotificationsModal';
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
import {getFavoritesPosts} from '../../../customSelectors/PostsSelectors';
import {getFavoriteRoutes} from '../../../customSelectors/SearchSelectors';
let searchObj = null;
const SearchRouteScreen = ({navigation, route}) => {
  var _ = require('lodash');

  const [isLoading, setIsLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState({from: true, open: false});
  const [openSearchedPost, setOpenSearchedPosts] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [total_pages, setTotalPages] = useState(1);
  const [dataSource, setDataSource] = useState([]);
  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const [lastActiveIndex, setLastActiveIndex] = useState(0);
  const [carouselItem, setCarouselItem] = useState(null);
  const [notificationsModalOpen, setNotificationModalOpen] = useState(false);

  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);
  const searchReducer = useSelector(state => state.searchReducer);
  let favoriteRoutes = useSelector(getFavoriteRoutes());
  const dispatch = useDispatch();
  const Tab = createMaterialTopTabNavigator();

  //following api calls need to be called only once per login
  useEffect(() => {
    dispatch(getFavoritePosts());
    dispatch(getRequests());
    dispatch(getTerms());
    dispatch(getUsersToRate());
  }, [myUser.email]);

  useEffect(() => {
    loadFavoriteRoutes();
  }, [searchReducer.triggerDatabase, myUser.email]);

  const loadFavoriteRoutes = async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      getFavorites(myUser.email, db).then(data => {
        if (data.length) {
          dispatch({type: GET_FAVORITE_ROUTES, payload: data});
        } else {
          dispatch({type: GET_FAVORITE_ROUTES, payload: []});
        }
      });
    } catch (error) {
      dispatch({type: GET_FAVORITE_ROUTES, payload: []});
    }
  };
  useEffect(() => {
    if (openSearch.open || openSearchedPost) {
      dispatch({type: HIDE_BOTTOM_TAB, payload: true});
    } else {
      dispatch({type: HIDE_BOTTOM_TAB, payload: false});
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
        car: await getCar(),
        cardate: (await getValue(filterKeys.carAge)) ?? '2000',
        gender: await getGender(),
        withReturn: await hasReturnDate(),
        petAllowed: await getPetAllowed(),
        returnStartDate: await getReturnStartDate(),
        returnEndDate: await getReturnEndDate(),
      },
    };
    console.log({searchObj});

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
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  const handleBackButtonClick = async () => {
    if (openSearch.open) {
      setOpenSearch({from: true, open: false});
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
          setInfoMessage({
            info: 'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως αρχικό προορισμό!',
            success: false,
          });
          showCustomLayout();
          return;
        }

        if (openSearch.from === true && post.searchEndcoord === coordinates) {
          setInfoMessage({
            info: 'Έχεις ήδη προσθέσει αυτή την τοποθεσία ως τελικό προορισμό!',
            success: false,
          });
          showCustomLayout();
          return;
        }

        dispatch({
          type: getType(isStartPoint),
          payload: [place, coordinates],
        });
      },
      errorCallback: () => {},
    });
  };

  function getType(isStartPoint) {
    return isStartPoint ? ADD_SEARCH_START_POINT : ADD_SEARCH_END_POINT;
  }

  const showCustomLayout = () => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
    }, 2000);
  };

  const showTabs = () => {
    return (
      !openSearch.open &&
      !openSearchedPost &&
      searchReducer.favoriteRoutes?.length > 0
    );
  };

  const {tabsStyle} = styles;

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
            : setOpenSearch({from: true, open: false});
        }}
        title={'Αναζήτηση ride'}
        showX={openSearch.open === true || openSearchedPost === true}
        onSettingsPress={() => {
          navigation.navigate(routes.SETTINGS_SCREEN, {email: myUser.email});
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
              tabBarLabelStyle: {textTransform: 'lowercase'},
              tabBarScrollEnabled: true,
              tabStyle: {
                width: '100%',
              },
            }}>
            <Tab.Screen name={constVar.favoritesTab}>
              {props => (
                <FavDestComponent
                  onSearchPosts={searchPosts}
                  onCarouselItemChange={currentCarouselItem =>
                    setCarouselItem(currentCarouselItem)
                  }
                />
              )}
            </Tab.Screen>

            <Tab.Screen name={constVar.searchTab}>
              {props => (
                <SearchScreenComponent
                  navigation
                  onSearchPosts={() => {
                    searchPosts();
                  }}
                  onOpenSearch={(from, open) => {
                    setOpenSearch({from: from, open: open});
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
            setOpenSearch({from: from, open: open});
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
            setOpenSearch({from: true, open: false});
          }}
        />
      )}
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />

      <InfoPopupModal
        preventAction={true}
        preventActionText={'Έξοδος'}
        isVisible={modalCloseVisible}
        description={'Είσαι σίγουρος θέλεις να κλείσεις την εφαρμογή;'}
        buttonText={'Όχι'}
        closeAction={() => {
          setModalCloseVisible(false);
        }}
        buttonPress={() => {
          BackHandler.exitApp();
        }}
        descrStyle={true}
      />
      <NotificationsModal
        onSubmit={(rating, text) => {}}
        isVisible={notificationsModalOpen}
        onProfileClick={(email, toEdit) => {
          setNotificationModalOpen(false);
          navigation.navigate(routes.PROFILE_STACK, {
            screen: routes.PROFILE_SCREEN,
            params: {email: email},
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
