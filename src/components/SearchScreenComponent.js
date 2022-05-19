import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  createRequest,
  getPlaceInfo,
  getRequests,
} from '../services/MainServices';
import {
  ADD_SEARCH_END_POINT,
  ADD_SEARCH_START_POINT,
  CLEAR_SEARCH_VALUES,
  GET_REQUESTS,
  TRIGGER_DATABASE,
} from '../actions/types';
import {InfoPopupModal} from '../utils/InfoPopupModal';
import {CustomInfoLayout} from '../utils/CustomInfoLayout';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {SelectLocationComponent} from './SelectLocationComponent';
import {RoundButton} from '../Buttons/RoundButton';
import {Spacer} from '../layout/Spacer';
import moment from 'moment';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {constVar} from '../utils/constStr';
import {SearchLocationComponent} from './SearchLocationComponent';
import {SearchedPostsComponent} from './SearchedPostsComponent';
import {
  createTable,
  getDBConnection,
  insertNewFav,
  insertRoute,
} from '../database/db-service';
import {Loader} from '../utils/Loader';
//import useRealm from '../database/allSchemas'
export function SearchScreenComponent({
  onOpenSearch,
  onSearchPosts,
  navigation,
}) {
  var _ = require('lodash');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const [modalCloseVisible, setModalCloseVisible] = useState(false);

  const myUser = useSelector(state => state.authReducer.user);
  const post = useSelector(state => state.postReducer);
  const requests = useSelector(state => state.requestsReducer.requests);
  let favoriteRoutes = useSelector(state => state.searchReducer.favoriteRoutes);

  const dispatch = useDispatch();

  const resetValues = () => {
    dispatch({type: CLEAR_SEARCH_VALUES, payload: {}});
  };

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
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
        dispatch({type: TRIGGER_DATABASE});
        if (favoriteRoutes?.length > 0) {
          setInfoMessage({
            info: 'Το ride προστέθηκε στα αγαπημένα σου!',
            success: true,
          });
          showCustomLayout();
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
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: errorMessage => {
        setIsLoading(false);
        setInfoMessage({info: errorMessage, success: false});
        showCustomLayout();
      },
    });
  };

  const showRequestsCta = () => {
    let start = requests.find(obj => obj.startcoord === post.searchStartcoord);
    let end = requests.find(obj => obj.endcoord === post.searchEndcoord);
    return !(start && end);
  };

  const showFavoriteCta = () => {
    let start = favoriteRoutes?.find(
      obj => obj.startcoord === post.searchStartcoord,
    );
    let end = favoriteRoutes?.find(obj => obj.endcoord === post.searchEndcoord);
    return !(start && end);
  };

  const {addΤοFav, addStopStyle, addToFavText, addToFavIcon, requestText} =
    styles;
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Loader isLoading={isLoading} />
      <View style={{paddingHorizontal: 16, marginTop: 15}}>
        <SelectLocationComponent
          onReset={resetValues}
          titleStart={constVar.startDestination}
          titleEnd={constVar.endDestination}
          startingPointPress={() => {
            onOpenSearch(true, true);
          }}
          endPointPress={() => {
            onOpenSearch(false, true);
          }}
        />

        <Spacer height={16} />
        <RoundButton
          disabled={post.searchStartplace === '' || post.searchEndplace === ''}
          text={'Αναζήτηση'}
          onPress={onSearchPosts}
          backgroundColor={colors.colorPrimary}
        />
      </View>

      {post.searchStartplace !== '' && post.searchEndplace !== '' && (
        <View View style={{marginTop: 14}}>
          {showFavoriteCta() && (
            <View style={addΤοFav}>
              <Text style={addToFavText}>
                Προσθήκη αναζήτησης στα αγαπημένα
              </Text>

              <TouchableOpacity onPress={addToFavorites} style={addToFavIcon}>
                <Ionicons name="add" size={15} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {showRequestsCta() && (
            <View>
              <Spacer height={10} />
              <Text style={requestText}>
                Θες να λαμβάνεις ειδοποίηση όταν δημιουργείται αντίστοιχο ride;
              </Text>

              <RoundButton
                containerStyle={[addStopStyle, {alignSelf: 'center'}]}
                leftIcon={true}
                text={'Αίτημα λήψης ειδοποίησης'}
                onPress={receiveNotification}
                backgroundColor={colors.colorPrimary}
              />
            </View>
          )}
        </View>
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
    backgroundColor: colors.infoColor,
    borderRadius: 50,
  },
  addToFavText: {
    fontSize: 14,
    color: '#595959',
    opacity: 0.6,
    marginStart: 10,
  },
  addΤοFav: {
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
