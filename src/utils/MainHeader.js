import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { CustomInput } from './CustomInput';
import { colors } from './Colors';
import { RoundButton } from '../Buttons/RoundButton';
import { Spacer } from '../layout/Spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { CloseIconComponent } from '../components/CloseIconComponent';
import { ViewRow } from '../components/HOCS/ViewRow';
import { useSelector } from 'react-redux';
import { getUsersToRate } from '../customSelectors/GeneralSelectors';

export function MainHeader({
    title,
    onSettingsPress,
    onClose,
    onLogout,
    showX,
    onFilterPress,
    onFavoritePostsPress,
    onNotificationPress,
    isCreatePost
}) {
    var _ = require('lodash');
    const { modal, container } = styles;
    const selectedColor = colors.colorPrimary
    const post = useSelector(state => state.postReducer)
    let usersToRate = useSelector(getUsersToRate)
    return (

        <View>
            {/* <View style={{ width: '100%', height: 20, backgroundColor: 'red' }}>
                <Text style={{ textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 'bold' }}>Δεν υπάρχει σύνδεση στο internet</Text>
            </View> */}
            <ViewRow>
                {showX &&
                    <View style={{ marginStart: 7, marginTop: 7 }}>
                        <CloseIconComponent onPress={onClose} />
                    </View>

                }

                <View style={[container, { flex: 1, marginStart: showX ? 8 : 30 }]}>

                    <ViewRow style={{ justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', alignSelf: 'center', flexWrap: 'wrap', fontSize: 19, marginStart: 14 }}>{title}</Text>
                        <ViewRow>
                            {!isCreatePost &&
                                <Ionicons onPress={onFilterPress} name="filter" color='white' size={23} style={{ alignSelf: 'center', marginEnd: 10 }} />
                            }
                            {isCreatePost && !_.isEmpty(post.favoritePosts) &&
                                <Entypo onPress={onFavoritePostsPress} name="heart-outlined" color='white' size={23} style={{ alignSelf: 'center', marginEnd: 10 }} />
                            }
                            {!_.isEmpty(usersToRate) &&
                                <Ionicons onPress={onNotificationPress} name="notifications" color='white' size={23} style={{ alignSelf: 'center', marginEnd: 10 }} />
                            }
                            <Icon onPress={onSettingsPress} name="settings" color='white' size={23} style={{ alignSelf: 'center' }} />
                        </ViewRow>

                    </ViewRow>



                </View>
            </ViewRow>

        </View >


    );
}

const styles = StyleSheet.create({


    container: {
        backgroundColor: colors.colorPrimary,
        borderBottomLeftRadius: 54,
        height: 'auto',

        padding: 10,
        marginStart: 6,


    },

});
