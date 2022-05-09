import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../utils/Colors';

export const CommonStyles = {
  row: {
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
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerBtnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
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
  titleStyle: {
    backgroundColor: colors.CoolGray2,
    padding: 5,
    paddingStart: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    width: 'auto',
    justifyContent: 'flex-end',
    marginStart: Dimensions.get('window').width / 4,
  },
  border: (width, color) => {
    return {
      borderWidth: width ? width : 1,
      borderColor: color ? color : 'black',
    };
  },
};
