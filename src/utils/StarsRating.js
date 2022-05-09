import React, {useState} from 'react';
import {useEffect} from 'react';
// import all the components we are going to use
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {colors} from './Colors';

export function StarsRating(props) {
  // To set the default Star Selected
  const [defaultRating, setDefaultRating] = useState(
    props.rating ? props.rating : 0,
  );
  // To set the max number of Stars
  const maxRating = [1, 2, 3, 4, 5];

  const marginRight = props.size === 'small' ? 2 : 22;
  return (
    <View style={[props.style, styles.customRatingBarStyle]}>
      {maxRating.map((item, key) => {
        !props.rating && props.setRating(defaultRating);

        return (
          <TouchableOpacity
            activeOpacity={1}
            key={item}
            onPress={() => {
              props.rating ? null : setDefaultRating(item);
            }}>
            <FontAwesome
              style={key == 4 ? {marginRight: 0} : {marginRight: marginRight}}
              name={
                item <= (props.rating ? props.rating : defaultRating)
                  ? 'star'
                  : 'star-o'
              }
              color={
                item <= (props.rating ? props.rating : defaultRating)
                  ? '#F0C30E'
                  : colors.Gray2
              }
              size={props.size === 'small' ? 12 : 32}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  customRatingBarStyle: {
    width: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
