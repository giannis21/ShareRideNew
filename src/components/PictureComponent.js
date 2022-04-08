import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/Colors';
import FastImage from 'react-native-fast-image'

export function PictureComponent({
    onPress,
    singleFile,
    openCamera,
    url,
    isLocal,
    imageSize,
    containerStyle,
}) {
    var _ = require('lodash');
    let imageWidth = 0

    const getStyle = () => {
        if (imageSize === 'big') {
            imageWidth = !singleFile && !url ? 72 : 92
            return styles.circleContainer
        } else if (imageSize === 'medium') {
            imageWidth = 46
            return styles.circleContainer1
        } else {
            imageWidth = 34
            return styles.circleContainer2
        }


    }

    const getUri = () => {
        let imageSingleData = isLocal ? singleFile : singleFile.data
        return 'data:image/jpg;base64,' + imageSingleData
    }
    console.log(url)
    return (

        <TouchableOpacity disabled={!onPress} style={[getStyle(), containerStyle]} onPress={() => onPress && onPress()} >
            <View style={[{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }]} >

                {/* <Image
                    style={[{ width: imageWidth, height: imageWidth }, styles.circle]}
                    source={

                        url ? { uri: "http://192.168.1.5:3000/images/giannisfragoulis21@gmail.com.jpeg" } : (
                            !_.isNull(singleFile)
                                ? { uri: getUri() }
                                : require('../assets/images/profile.png')
                        )

                    }
                    key={new Date()}
                /> */}
                <FastImage
                    style={[{ width: imageWidth, height: imageWidth }, styles.circle]}
                    source={

                        url ? { uri: url, cache: FastImage.cacheControl.web } : (
                            !_.isNull(singleFile)
                                ? { uri: getUri(), cache: FastImage.cacheControl.web }
                                : require('../assets/images/profile.png')
                        )

                    }

                />
            </View>


            {openCamera && <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 4 }}>
                <View style={[{ borderRadius: 20, position: 'absolute', backgroundColor: 'white', width: 39, height: 39, justifyContent: 'center' }]}>
                    <Feather style={{ alignSelf: 'center' }} name="camera" size={27} color='black' />
                </View>
            </View>
            }
        </TouchableOpacity>


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
    circle: {
        borderRadius: 100 / 2,

    },
    circleContainer: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: colors.Gray2,
    },
    circleContainer1: {
        width: 50,
        height: 50,
        borderRadius: 100 / 2,
        backgroundColor: colors.Gray2,
    },
    circleContainer2: {
        width: 37,
        height: 37,
        borderRadius: 100 / 2,
        backgroundColor: colors.Gray2,
    },
    maskInputContainer: {
        marginVertical: Platform.OS === 'ios' ? 13 : 20,
        paddingVertical: Platform.OS === 'ios' ? 0 : 20,
        fontSize: 14,
        backgroundColor: 'black',

    },
});
