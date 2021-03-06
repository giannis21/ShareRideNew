import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { createRequest, getRequests } from '../services/MainServices';
import { TRIGGER_DATABASE } from '../actions/types';
import { InfoPopupModal } from '../utils/InfoPopupModal';
import { useDispatch, useSelector } from 'react-redux';
import { SelectLocationComponent } from './SelectLocationComponent';
import { RoundButton } from '../Buttons/RoundButton';
import { Spacer } from '../layout/Spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  createTable,
  getDBConnection,
  insertRoute,
} from '../database/db-service';
import { Loader } from '../utils/Loader';
import { clearSearchValues } from '../actions/actions';
import { showToast } from '../utils/Functions';
import { useIsFocused } from '@react-navigation/native';
export function SearchScreenComponent({
  onOpenSearch,
  onSearchPosts,
  navigation,
}) {
  var _ = require('lodash');
  const [isLoading, setIsLoading] = useState(false);
  const [modalCloseVisible, setModalCloseVisible] = useState(false);

  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);
  const requests = useSelector(state => state.requestsReducer.requests);
  const content = useSelector(state => state.contentReducer.content);
  let favoriteRoutes = useSelector(state => state.searchReducer.favoriteRoutes);

  const isFocused = useIsFocused()
  const dispatch = useDispatch();

  const resetValues = () => {
    dispatch(clearSearchValues());
  };


  const addToFavorites = async () => {
    let data = {
      startcoord: post.searchStartcoord.toString(),
      startplace: post.searchStartplace.toString(),
      endcoord: post.searchEndcoord.toString(),
      endplace: post.searchEndplace.toString(),
      compoundKey: `${post.searchStartcoord} - ${post.searchEndcoord} - ${myUser.email}`,
      email: myUser.email,
    };

    const db = await getDBConnection();
    await createTable(db);

    insertRoute(data, db)
      .then(data => {
        dispatch({ type: TRIGGER_DATABASE });
        if (favoriteRoutes?.length > 0) {
          showToast(content.rideAddedToFavorites)
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const receiveNotification = () => {
    let data = {
      data: {
        startplace: post.searchStartplace,
        startcoord: post.searchStartcoord,
        endplace: post.searchEndplace,
        endcoord: post.searchEndcoord,
      },
    };
    setIsLoading(true);
    createRequest({
      data,
      successCallback: message => {
        setIsLoading(false);
        dispatch(getRequests());
        showToast(message)
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        showToast(errorMessage, false)
      },
    });
  };

  const showRequestsCta = useMemo(() => {
    let start = requests.find(obj => obj.startcoord === post.searchStartcoord);
    let end = requests.find(obj => obj.endcoord === post.searchEndcoord);
    return !(start && end);
  }, [requests, isFocused])

  const showFavoriteCta = useMemo(() => {
    let start = favoriteRoutes?.find(
      obj => obj.startcoord === post.searchStartcoord,
    );
    let end = favoriteRoutes?.find(obj => obj.endcoord === post.searchEndcoord);
    return !(start && end);
  }, [favoriteRoutes, isFocused])

  const { add????Fav, addStopStyle, addToFavText, addToFavIcon, requestText } =
    styles;

  const renderSelectionComponent = useCallback(() =>
    <SelectLocationComponent
      onReset={resetValues}
      titleStart={content.startDestination}
      titleEnd={content.endDestination}
      startingPointPress={() => {
        onOpenSearch(true, true);
      }}
      endPointPress={() => {
        onOpenSearch(false, true);
      }}
    />
    , []);

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Loader isLoading={isLoading} />
      <View style={{ paddingHorizontal: 16, marginTop: 15 }}>
        {renderSelectionComponent()}
        <Spacer height={16} />
        <RoundButton
          disabled={post.searchStartplace === '' || post.searchEndplace === ''}
          text={content.searchBottomTab}
          onPress={onSearchPosts}
          backgroundColor={colors.colorPrimary}
        />
      </View>

      {post.searchStartplace !== '' && post.searchEndplace !== '' && (
        <View View style={{ marginTop: 14 }}>
          {showFavoriteCta && (
            <View style={add????Fav}>
              <Text style={addToFavText}>
                {content.addToFavorites}
              </Text>

              <TouchableOpacity onPress={addToFavorites} style={addToFavIcon}>
                <Ionicons name="add" size={15} color={colors.colorPrimary} />
              </TouchableOpacity>
            </View>
          )}

          {showRequestsCta && (
            <View>
              <Spacer height={10} />
              <Text style={requestText}>
                {content.receiveNotification}
              </Text>

              <RoundButton
                containerStyle={[addStopStyle, { alignSelf: 'center' }]}
                leftIcon={true}
                text={content.requestNotification}
                onPress={receiveNotification}
                backgroundColor={colors.colorPrimary}
              />
            </View>
          )}
        </View>
      )}


      <InfoPopupModal
        preventAction={true}
        preventActionText={content.exit}
        isVisible={modalCloseVisible}
        description={content.closeAppAsk}
        buttonText={content.no}
        closeAction={() => {
          setModalCloseVisible(false);
        }}
        buttonPress={() => {
          BackHandler.exitApp();
        }}
        descrStyle={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  requestText: {
    fontSize: 14,
    color: '#595959',
    opacity: 0.6,
    marginHorizontal: 40,
    marginVertical: 10,
    alignSelf: 'center',
  },
  addToFavIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: colors.colorPrimary,
    borderWidth: 1
  },
  addToFavText: {
    fontSize: 14,
    color: '#595959',
    opacity: 0.6,
    marginStart: 10,
  },
  add????Fav: {
    paddingHorizontal: 13,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'baseline',

    borderRadius: 13,
    marginEnd: 10,
  },

  addStopStyle: {
    borderRadius: 22,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: 'baseline',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.colorPrimary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
