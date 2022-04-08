import { Animated, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { constVar } from '../utils/constStr';
import { colors } from '../utils/Colors';

function SearchTopTabBar({ state, descriptors, navigation, position, isSearchOpen, onChangeIndex, lastActiveIndex }) {

    const changeTab = () => {
        setTimeout(() => {
            navigation.jumpTo(lastActiveIndex === 0 ? constVar.favoritesTab : constVar.searchTab);
        }, 300);
    }
    useEffect(() => {
        changeTab()
    }, [isSearchOpen])

    return (
        <View style={{ flexDirection: 'row' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;
                if (isFocused) {
                    onChangeIndex(index)
                }
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const inputRange = state.routes.map((_, i) => i);
                const opacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(i => (i === index ? 1 : 0)),
                });

                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            padding: 13,
                            borderBottomColor: colors.colorPrimary,
                            borderBottomWidth: isFocused ? 2 : 0
                        }}
                    >
                        <Animated.Text style={{ fontSize: 14, color: isFocused ? colors.colorPrimary : colors.title_grey }}>
                            {label}
                        </Animated.Text>
                    </TouchableOpacity>
                );
            })}
        </View >
    );
}

export default SearchTopTabBar