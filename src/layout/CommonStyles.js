import {StyleSheet} from 'react-native';
import {colors} from '../utils/Colors';

export const CommonStyles = {
  row: {
    flexDirection: 'row',
  },
  halfLine: {
    width: '20%',
    alignSelf: 'flex-start',
    height: 7,
    backgroundColor: colors.CoolGray2,
    borderRadius: 15,
  },
  logoStyle: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? 70 : 100,
  },
  rowWrap: {
    flexWrap: 'wrap',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyEvenly: {
    justifyContent: 'space-evenly',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  border: (width, color) => {
    return {
      borderWidth: width ? width : 1,
      borderColor: color ? color : 'black',
    };
  },
};
