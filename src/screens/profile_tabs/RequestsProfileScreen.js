import React, {useState, useEffect} from 'react';
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
  Platform,
} from 'react-native';
import {PostLayoutComponent} from '../../components/PostLayoutComponent';
import {BaseView} from '../../layout/BaseView';
import {Spacer} from '../../layout/Spacer';

import {routes} from '../../navigation/RouteNames';
import {
  deleteRequest,
  getInterested,
  getInterestedPerUser,
  getRequests,
  showInterest,
} from '../../services/MainServices';
import {colors} from '../../utils/Colors';
import {CustomInfoLayout} from '../../utils/CustomInfoLayout';
import {Loader} from '../../utils/Loader';
import {OpenImageModal} from '../../utils/OpenImageModal';
import {useNavigation} from '@react-navigation/native';
import {TopContainerExtraFields} from '../../components/TopContainerExtraFields';
import {useDispatch, useSelector} from 'react-redux';
import {ViewRow} from '../../components/HOCS/ViewRow';
import {PictureComponent} from '../../components/PictureComponent';
import {BASE_URL} from '../../constants/Constants';
import RNFetchBlob from 'rn-fetch-blob';
import {StarsRating} from '../../utils/StarsRating';
import {DestinationsComponent} from '../../components/DestinationsComponent';
import {InfoPopupModal} from '../../utils/InfoPopupModal';
import {DELETE_REQUEST} from '../../actions/types';
const RequestsProfileScreen = ({navigation, route}) => {
  const [total_pages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [modalCloseVisible, setModalCloseVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSafeClick, setSafeClick] = useState(true);
  const [showContent, setShowContent] = React.useState(true);
  const [singleFile, setSingleFile] = useState(null);
  const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState({info: '', success: false});
  const navigation1 = useNavigation();
  const requestsReducer = useSelector(state => state.requestsReducer);
  const myUser = useSelector(state => state.authReducer.user);
  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    setSingleFile(myUser.photoProfile);
  }, [myUser.photoProfile]);

  let dispatch = useDispatch();

  useEffect(() => {
    setDataSource(requestsReducer.requests);
  }, [requestsReducer.requests]);

  const showCustomLayout = callback => {
    setShowInfoModal(true);
    setTimeout(function () {
      setShowInfoModal(false);
      if (callback) callback();
    }, 2000);
  };
  const deleteCurrentRequest = () => {
    let data = {
      data: {
        postSearchId: itemToBeDeleted,
      },
    };

    setModalCloseVisible(false);
    deleteRequest({
      data,
      successCallback: message => {
        dispatch({
          type: DELETE_REQUEST,
          payload: itemToBeDeleted,
        });
        setInfoMessage({info: message, success: true});
        showCustomLayout();
      },
      errorCallback: message => {
        setInfoMessage({info: message, success: false});
        showCustomLayout();
      },
    });
  };
  const openDeleteModal = postSearchId => {
    setItemToBeDeleted(postSearchId);
    setModalCloseVisible(true);
  };

  const successCallback = data => {
    // setDataSource(data);
    // setLoading(false)
    // setShowPlaceholder(false)
  };
  const errorCallback = () => {
    setLoading(false);
    setShowPlaceholder(false);
  };
  const ItemView = ({item}) => {
    return (
      <View
        style={{
          height: 'auto',
          backgroundColor: 'white',
          borderRadius: 5,
          marginHorizontal: 5,
        }}>
        <Spacer height={5} />

        <ViewRow>
          <View style={{width: '12%', marginStart: 6}}>
            <PictureComponent
              isLocal={true}
              singleFile={singleFile}
              imageSize={'small'}
            />
            <Spacer width={15} />
          </View>

          <View style={{marginTop: 3, width: '88%'}}>
            <ViewRow style={{justifyContent: 'space-between'}}>
              <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black'}}>
                {myUser.fullName}
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: '#595959',
                  opacity: 0.6,
                  marginEnd: 10,
                }}>
                {' '}
                {item.created_at}
              </Text>
            </ViewRow>

            <Spacer height={10} />
            <View style={{alignItems: 'flex-start'}}>
              <StarsRating rating={3} size="small" />
            </View>
            <Spacer height={5} />

            <ViewRow style={{justifyContent: 'space-between'}}>
              <DestinationsComponent
                containerStyle={{marginTop: 10, marginBottom: 15}}
                startplace={item.startplace}
                endplace={item.endplace}
              />

              <TouchableOpacity
                onPress={() => openDeleteModal(item.postSearchId)}
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                <Text style={remove}>Αφαίρεση</Text>
              </TouchableOpacity>
            </ViewRow>

            <View
              style={{
                width: '100%',
                backgroundColor: colors.CoolGray1.toString(),
                height: 1,
              }}
            />
          </View>
        </ViewRow>
      </View>
    );
  };

  const {remove} = styles;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 0,
        backgroundColor: 'white',
      }}>
      <View style={styles.container}>
        <TopContainerExtraFields
          showArrow
          addMarginStart={true}
          onCloseContainer={goBack}
          title={'Τα αιτήματα μου'}
        />
        <Spacer height={5} />

        <View style={styles.container}>
          <FlatList
            data={dataSource}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            keyExtractor={(item, index) => 'item' + index}
            renderItem={ItemView}
          />
        </View>
      </View>
      <CustomInfoLayout
        isVisible={showInfoModal}
        title={infoMessage.info}
        icon={!infoMessage.success ? 'x-circle' : 'check-circle'}
        success={infoMessage.success}
      />
      <InfoPopupModal
        preventActionText={'Άκυρο'}
        preventAction={true}
        isVisible={modalCloseVisible}
        description={
          'Είσαι σίγουρος/η θέλεις να σταματήσεις να λαμβάνεις ειδοποιήσεις για αυτό το ride;'
        }
        buttonText={'Ναι, σίγουρος/η'}
        closeAction={() => {
          setModalCloseVisible(false);
        }}
        buttonPress={deleteCurrentRequest}
        descrStyle={true}
      />
    </View>
  );
};

export default RequestsProfileScreen;

const styles = StyleSheet.create({
  remove: {
    color: 'white',
    borderRadius: 4,
    paddingVertical: 2,
    marginEnd: 10,
    marginBottom: 10,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    backgroundColor: 'red',
    overflow: Platform.OS === 'ios' ? 'hidden' : 'visible',
  },
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
