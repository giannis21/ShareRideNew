import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

export function usePreventGoBack(handler) {
    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", handler);

    //     return () => {
    //         BackHandler.removeEventListener(
    //             "hardwareBackPress",
    //             handler
    //         );
    //     };
    // }, [handler]);

    useFocusEffect(useCallback(() => {
        BackHandler.addEventListener("hardwareBackPress", handler);
        return () => BackHandler.removeEventListener("hardwareBackPress", handler);
    }, [handler]));
}
