import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RoundButton} from '../Buttons/RoundButton';
//import Carousel, { Pagination } from 'react-native-snap-carousel';
import {useIsFocused} from '@react-navigation/native';
import {
  createTable,
  deleteRoute,
  getDBConnection,
  getFavorites,
} from '../database/db-service';
import {useDispatch, useSelector} from 'react-redux';
import {TRIGGER_DATABASE} from '../actions/types';
import {getFavoriteRoutes} from '../customSelectors/SearchSelectors';
const {width} = Dimensions.get('screen');

export function FavDestComponent({
  containerStyle,
  onSearchPosts,
  onCarouselItemChange,
}) {
  let data = useSelector(getFavoriteRoutes());

  const [carouselData, setCarouselData] = useState([]);
  const [isRender, setIsRender] = useState(false);

  let dispatch = useDispatch();

  useEffect(() => {
    console.log('dataaaa', data.length);
    setCarouselData(data);
  }, [data.length]);

  const deleteItem = async item => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      deleteRoute(item.compoundKey, db);
      dispatch({type: TRIGGER_DATABASE});
      onCarouselItemChange(null);
    } catch (error) {
      console.error(error);
    }
  };

  const updateList = (index, compoundKey) => {
    let tempList = carouselData;

    tempList = tempList.map(item => {
      return {
        ...item,
        isSelected: 0,
      };
    });

    let updated = tempList.find(obj => obj.compoundKey === compoundKey);
    updated.isSelected = updated.isSelected === 1 ? 0 : 1;
    tempList[index] = updated;

    setCarouselData(tempList);
    setIsRender(!isRender);
    onCarouselItemChange(updated);
  };

  function RenderFavorite({item, index, onItemPress}) {
    return (
      <TouchableOpacity activeOpacity={1} onPress={() => onItemPress(index)}>
        <View
          style={
            item.isSelected === 1 ? styles.containerSelected : styles.container
          }>
          <Text style={{fontWeight: 'bold', color: 'black'}}>Από</Text>
          <Text style={styles.textStyle1}>{item.startplace}</Text>
          <Entypo
            name={'arrow-long-down'}
            size={30}
            style={{
              alignSelf: 'center',
              marginTop: 10,
              transform: [{translateY: 7}],
            }}
            color={colors.colorPrimary}
          />
          <Text style={{fontWeight: 'bold', color: 'black'}}>Μέχρι</Text>
          <Text style={styles.textStyle1}>{item.endplace}</Text>
        </View>
        {item.isSelected === 1 && (
          <TouchableOpacity
            onPress={() => {
              deleteItem(item);
            }}
            style={styles.circle}>
            <MaterialCommunityIcons name={'delete'} size={20} color={'white'} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      {data?.length > 0 ? (
        <View>
          <FlatList
            horizontal
            data={carouselData}
            extraData={isRender}
            keyExtractor={(item, index) => index}
            enableEmptySections={true}
            renderItem={({item, index}) => {
              return (
                <RenderFavorite
                  item={item}
                  index={index}
                  onItemPress={index => {
                    updateList(index, item.compoundKey);
                  }}
                />
              );
            }}
          />
          {carouselData.length > 0 &&
            carouselData.find(obj => obj.isSelected === 1) && (
              <RoundButton
                containerStyle={{marginHorizontal: 15}}
                text={'Αναζήτηση'}
                onPress={onSearchPosts}
                backgroundColor={colors.colorPrimary}
              />
            )}
        </View>
      ) : null}

      {/* <Carousel
                enableMomentum={false}
                activeDotIndex={activeIndex}
                dotColor={'black'}
                activeSlideAlignment={'start'}
                layout='default'
                //ref={ref}
                data={carouselData}
                sliderWidth={width}
                itemWidth={372}
                renderItem={renderFavorite}
                decelerationRate={'fast'}
                removeClippedSubviews={false}
                inactiveSlideScale={0.62}
                inactiveSlideOpacity={0.65}
                onSnapToItem={(index) => {
                    console.log(carouselData[index], index)
                    onCarouselItemChange(carouselData[index])
                    setActiveIndex(index);
                    //onSnapToItem(index);
                }}

            />
            {carouselData.length > 1 && (
                <Pagination
                    activeDotIndex={activeIndex}
                    dotsLength={carouselData.length}
                    containerStyle={{ marginTop: -32 }}
                    dotStyle={{
                        width: 16,
                        height: 4,
                        borderRadius: 8,
                        marginRight: -12,
                        backgroundColor: colors.colorPrimary
                    }}
                    inactiveDotStyle={{
                        borderRadius: 8,
                        backgroundColor: colors.CoolGray1
                    }}
                />
            )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 100 / 2,
    backgroundColor: 'red',
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 10,
    padding: 10,
    transform: [{translateX: -7}],
  },
  container: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: colors.CoolGray1,
    height: 'auto',
    margin: 20,
    borderRadius: 10,
    borderStyle: 'dashed',
    width: width / 1.2,
    padding: 10,
  },
  containerSelected: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: colors.verifiedUser,
    height: 'auto',
    margin: 20,
    borderRadius: 10,
    borderStyle: 'dashed',
    width: width / 1.2,
    padding: 10,
  },
  textStyle1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5,
    backgroundColor: colors.grey200,
    paddingVertical: 1,

    textAlign: 'center',
    borderRadius: 5,
  },
});
