import {
  Modal,
  Text,
  Pressable,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Spacer} from '../layout/Spacer';
import {colors} from './Colors';
import {RoundButton} from '../Buttons/RoundButton';
import {CustomInput} from './CustomInput';
import {StarsRating} from './StarsRating';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CommentInputComponent} from '../components/CommentInputComponent';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const GlobalModalScreen = ({Route, navigation}) => {
  const [rating, setCurrentRating] = useState(0);
  const [comment, setComment] = useState('');

  const {modal, container} = styles;

  return (
    <SafeAreaView style={{backgroundColor: 'rgba(0,0,0,0.15)', flex: 1}}>
      <View style={container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.colorPrimary,
          }}>
          <Text
            style={{
              padding: 3,
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            Νεο Ride
          </Text>
        </View>

        <Text style={{padding: 15}}>Δημιουργηθηκε Ride Αθηνα-θεσσαλονικη</Text>
      </View>
      <View style={styles.circle}>
        <MaterialCommunityIcons
          onPress={() => {
            navigation.pop();
          }}
          name={'close'}
          size={21}
          color={'black'}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modal: {},
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    height: 'auto',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 12,
  },
  circle: {
    borderRadius: 100 / 2,
    backgroundColor: 'white',
    borderWidth: 0.4,
    position: 'absolute',
    alignSelf: 'flex-end',
    marginTop: 46,
    padding: 10,
  },
  descriptionStyle: {
    paddingVertical: 32,
    textAlign: 'center',
  },
});
