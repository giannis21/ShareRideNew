import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import {Spacer} from '../layout/Spacer';
import {TextInput} from 'react-native-gesture-handler';
import {colors} from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ViewRow} from '../components/HOCS/ViewRow';
import {CustomIcon} from '../components/CustomIcon';
import {constVar} from './constStr';

export function CustomInput({
  text,
  onPressIn,
  hasBottomArrow,
  inputRef,
  onSubmitEditing,
  returnKeyType,
  hasIcon,
  keyboardType,
  secureTextEntry,
  onChangeText,
  onIconPressed,
  value,
  maxLenth,
  extraStyle,
  labelNot,
  placeHolder,
  disabled,
  icon,
  isError,
  autoFocus,
  errorText,
  onKeyPress,
}) {
  return (
    <View
      style={[
        styles.SectionStyle,
        {extraStyle, borderBottomColor: isError ? 'red' : colors.colorPrimary},
      ]}>
      {!labelNot && (
        <View>
          <Text style={{color: isError ? 'red' : '#8b9cb5'}}>
            {isError ? errorText : text}
          </Text>
          <Spacer height={Platform.OS === 'ios' ? 14 : 0} />
        </View>
      )}

      <View>
        <ViewRow>
          <TextInput
            autoCorrect={false}
            onKeyPress={() => {
              onKeyPress && onKeyPress();
            }}
            autoFocus={autoFocus ? true : null}
            onSubmitEditing={onSubmitEditing ? onSubmitEditing : undefined}
            ref={inputRef}
            editable={disabled ? false : true}
            style={styles.inputStyle}
            placeholderTextColor="#8b9cb5"
            placeholder={placeHolder ? placeHolder : null}
            autoCapitalize="none"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry ? true : false}
            returnKeyType={returnKeyType}
            blurOnSubmit={false}
            maxLength={maxLenth}
            onChangeText={onChangeText}
            value={value}
          />

          {hasIcon ? (
            <TouchableOpacity
              activeOpacity={0.1}
              style={{
                marginRight: 5,
                justifyContent: 'flex-end',
                marginBottom: Platform.OS === 'android' ? 16 : 0,
              }}
              onPress={onIconPressed}>
              {icon ? (
                <CustomIcon
                  style={{
                    color: colors.colorPrimary,
                  }}
                  name="info"
                  type="Feather"
                  size={20}
                  color={colors.colorPrimary}
                />
              ) : secureTextEntry ? (
                <CustomIcon
                  name="eye-off"
                  size={20}
                  type="Feather"
                  color={colors.colorPrimary}
                />
              ) : (
                <Feather color={colors.colorPrimary} name="eye" size={20} />
              )}
            </TouchableOpacity>
          ) : null}
          {hasBottomArrow && (
            <AntDesign
              name={'caretdown'}
              size={16}
              style={{marginRight: 5}}
              color={colors.colorPrimary}
            />
          )}
        </ViewRow>
        {onPressIn && (
          <Pressable
            style={styles.pressabbleStyle}
            disabled={!onPressIn}
            onPress={() => {
              onPressIn();
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'column',
    height: 57,
    // width: '100%',
    marginTop: 20,
    borderBottomWidth: 1,
  },
  pressabbleStyle: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputStyle: {
    flex: 1,
    color: 'black',
  },
});
