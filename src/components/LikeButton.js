import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {Pressable, View, Button, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../utils/Colors';

export const LikeButton = ({onPress, isLiked, postId}) => {
  const liked = useSharedValue(0);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });

  useEffect(() => {
    liked.value = withSpring(!isLiked ? 0 : 1);
  }, [isLiked]);

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        onPress && onPress();
      }}>
      <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
        <MaterialCommunityIcons
          name={'heart-outline'}
          size={20}
          color={colors.like_red}
        />
      </Animated.View>

      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons
          name={'heart'}
          size={20}
          color={colors.like_red}
        />
      </Animated.View>
    </Pressable>
  );
};

// export default function AnimatedStyleUpdateExample(props) {
//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//       }}>
//       <LikeButton />
//     </View>
//   );
// }
