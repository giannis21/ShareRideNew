import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { getAutoComplete, getPlaceInfo } from '../services/MainServices';
import { colors } from '../utils/Colors';
import { CustomInput } from '../utils/CustomInput';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Spacer } from '../layout/Spacer';
import { useSelector, useDispatch } from 'react-redux';
import {
  ADD_MIDDLE_STOP,
  IS_SEARCH_OPEN,
  REMOVE_MIDDLE_STOP,
  REMOVE_MIDDLE_STOPS,
} from '../actions/types';
import { useIsFocused } from '@react-navigation/native';
import { Loader } from '../utils/Loader';

export function SearchLocationComponent({
  onPress,
  from,
  addStops,
  isStartPoint,
  showMessage,
}) {
  var _ = require('lodash');
  const content = useSelector(state => state.contentReducer.content);

  const [value, setValue] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [isRender, setIsRender] = useState(false);
  const [selectionEnabled, setSelectionEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const post = useSelector(state => state.postReducer);
  const dispatch = useDispatch();

  let getLocation = value => {
    setValue(value);

    getAutoComplete({
      value,
      successCallback: data => {
        setDataSource(data);
      },
      errorCallback: () => { },
    });
  };

  let getPlace = item => {
    setIsLoading(true);
    getPlaceInfo({
      place_id: item.place_id,
      successCallback: coordinates => {
        setIsLoading(false);
        setSelectionEnabled(true);
        if (post.startcoord === coordinates) {
          showMessage(content.alreadyAddedAsInitial);
          return;
        }

        if (post.endcoord === coordinates) {
          showMessage(content.alreadyAddedAsFinal);
          return;
        }

        if (!post.moreplaces.find(obj => obj.placecoords === coordinates)) {
          let place1 = {
            place: item.description.split(',')[0] ?? item.description,
            placecoords: coordinates,
          };

          dispatch({
            type: ADD_MIDDLE_STOP,
            payload: place1,
          });
          return;
        }

        showMessage(content.stopAlreadyAdded);
      },
      errorCallback: () => {
        setIsLoading(false);
        setSelectionEnabled(true);
      },
    });
  };

  const updateList = (item, coordinates, val) => {
    let updated = dataSource.find(obj => obj === item);
    let index = dataSource.indexOf(updated);

    updated.isSelected = val;
    updated.coordinates = coordinates;
    let tempArr = dataSource;

    tempArr[index] = updated;
    setDataSource(tempArr);
    setIsRender(!isRender);
  };

  const LocationItem = ({ item, addStopsPress }) => {
    let itemStringified = JSON.stringify(item);
    let itemStringified1 = JSON.parse(itemStringified);

    return (
      <TouchableOpacity
        onPress={() => {
          if (!addStops) {
            onPress(
              itemStringified1.item.place_id,
              itemStringified1.item.structured_formatting.main_text,
              from,
            );
            return;
          }
          addStopsPress(item.item);
        }}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row' }}>
          <Entypo
            name="location-pin"
            size={24}
            style={{ opacity: 0.3 }}
            color={'black'}
          />

          <View marginStart={10}>
            <Text style={{ color: 'black' }}>
              {itemStringified1.item.structured_formatting.main_text}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: '#595959',
                opacity: 0.6,
              }}>
              {itemStringified1.item.structured_formatting.secondary_text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const clearMiddleStops = () => {
    dispatch({
      type: REMOVE_MIDDLE_STOPS,
      payload: {},
    });
  };
  const renderSelectedLocations = () => {
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{ width: '83%', flexDirection: 'row', marginEnd: 10 }}>
          {post.moreplaces.map(obj => {
            return (
              <View style={savedLocationStyle}>
                <Entypo
                  name="location-pin"
                  size={24}
                  color={'white'}
                  style={{ opacity: 0.5 }}
                />

                <View marginStart={5}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: 'white',
                      opacity: 0.8,
                    }}>
                    {obj.place.split(',')[0]}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={clearMiddleStops}
          style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={'white'}
            style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 5,
              alignSelf: 'center',
              overflow: 'hidden',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const { savedLocationStyle } = styles;

  return (
    <View style={{ width: '100%', height: '100%', paddingHorizontal: 8 }}>
      <Loader isLoading={isLoading} />
      <CustomInput
        autoFocus={true}
        text={!addStops ? content.searchLocation : content.searchMiddleStops}
        keyboardType="default"
        onChangeText={getLocation}
        value={value}
      />
      {addStops &&
        post?.moreplaces &&
        !_.isEmpty(post.moreplaces) &&
        renderSelectedLocations()}

      <Spacer height={20} />
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={dataSource}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        extraData={isRender}
        keyExtractor={(item, index) => index}
        enableEmptySections={true}
        renderItem={item => {
          return (
            <LocationItem
              item={item}
              addStopsPress={item => {
                if (!selectionEnabled) return;

                setSelectionEnabled(false);
                if (post?.moreplaces && post?.moreplaces.length >= 3) {
                  showMessage(
                    content.noMore3Stops,
                  );
                } else {
                  getPlace(item);
                }
              }}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  savedLocationStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorPrimary,
    padding: 6,
    borderRadius: 5,
    marginEnd: 10,
  },
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
