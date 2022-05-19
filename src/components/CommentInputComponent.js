import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import {Spacer} from '../layout/Spacer';
import {colors} from '../utils/Colors';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {ViewRow} from './HOCS/ViewRow';
import {useSelector} from 'react-redux';

export function CommentInputComponent({
  placeholder,
  onChangeText,
  value,
  maxLenth,
  extraStyle,
  removeNote,
  onFocus,
}) {
  const generalReducer = useSelector(state => state.generalReducer);

  return (
    <View>
      <View style={[styles.SectionStyle, extraStyle]}>
        <ViewRow>
          <EvilIcons
            style={{
              color: '#8b9cb5',
              opacity: 0.6,
              marginTop: 6,
              marginStart: 6,
            }}
            name="comment"
            size={30}
            color="grey"
          />

          <TextInput
            editable={!generalReducer.isToolTipVisible}
            textAlignVertical={'top'}
            returnKeyType="done"
            onFocus={onFocus}
            style={styles.inputStyle}
            placeholderTextColor="#8b9cb5"
            autoCapitalize="none"
            keyboardType="default"
            multiline={true}
            placeholder={placeholder ? placeholder : 'σχόλια..'}
            blurOnSubmit={false}
            maxLength={maxLenth}
            onChangeText={onChangeText}
            value={value}
          />
        </ViewRow>
      </View>
      {!removeNote && (
        <View>
          <Spacer height={4} />
          <Text style={{fontSize: 13, color: '#8b9cb5', marginStart: 12}}>
            *Είναι σημαντικό να γίνεται όσο τον δυνατόν αντικειμενική
            αξιολόγηση. Ευχαριστούμε!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'column',
    height: 80,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#8b9cb5',
    borderRadius: 14,
    marginHorizontal: 12,
  },

  inputStyle: {
    flex: 1,
    color: 'black',
    marginStart: 5,
    marginTop: Platform.OS === 'android' ? -5 : 4,
  },
});
