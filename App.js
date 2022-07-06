import * as React from 'react';
import { View, Text, LogBox, AppState } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './src/stacks/AuthStack';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { routes } from './src/navigation/RouteNames';
//import MainTabStack from './src/stacks/MainTabStack';
import HomeStack from './src/stacks/MainTabStack';
import { Provider, useSelector } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import AppReducers from './src/configureStore';
import ModalAnimationHOC from './src/components/HOCS/ModalAnimationHOC';
import GeneralHocScreen from './src/screens/GeneralHocScreen';
import { getValue, keyNames, setValue } from './src/utils/Storage';
import { UPDATE_USER } from './src/actions/types';
import PushNotification from 'react-native-push-notification';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { store } from '.';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { setLanguage } from './src/actions/actions';
import { colors } from './src/utils/Colors';
import { ViewRow } from './src/components/HOCS/ViewRow';
import Feather from 'react-native-vector-icons/Feather';

let Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

const toastConfig = {

  customToast: ({ text1, props }) => (
    <View style={{ flexDirection: 'row', height: 'auto', width: '95%', backgroundColor: props.success ? colors.infoGreen : colors.LightRed, borderRadius: 12 }}>
      <View style={{ padding: 18 }}>
        <Feather style={{ alignSelf: 'center' }} name={props.success ? 'check-circle' : 'x-circle'} size={20} color={'white'} />
      </View>
      <Text style={{ alignSelf: 'center', color: 'white', width: '85%' }}>{text1}</Text>
    </View>
  )
}
const createChannel = () => {
  PushNotification.createChannel({
    channelId: 'share',
    channelName: 'ShareRide',
    playSound: false,
  });
};

const loadLanguage = async () => {
  if (await getValue(keyNames.currentLanguage) !== "GR") {
    store.dispatch(setLanguage(require('./src/assets/content/contentEN.json')))
  } else {
    store.dispatch(setLanguage(require('./src/assets/content/contentGR.json')))
  }
}

function App() {
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    loadLanguage()
  }, [])

  React.useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, notification => { });

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  });

  React.useEffect(() => {
    createChannel();
  }, []);
  // ************* HANDLE APP STATE CHANGE ******************

  const _handleAppStateChange = async nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to the foreground!
      refresh();
    }

    if (
      appState.current.match(/active|background/) &&
      nextAppState === 'inactive'
    ) {
      // App has come to the background!
    }

    appState.current = nextAppState;
  };

  const refresh = async () => {
    let updatedValues = {
      age: await getValue(keyNames.age),
      car: await getValue(keyNames.car),
      carDate: await getValue(keyNames.carDate),
      facebook: await getValue(keyNames.facebook),
      fullName: await getValue(keyNames.fullName),
      instagram: await getValue(keyNames.instagram),
      phone: await getValue(keyNames.phone),
      token: await getValue(keyNames.token),
    };

    store.dispatch({ type: UPDATE_USER, payload: updatedValues });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        mode="modal"
        screenOptions={{ animationEnabled: false, headerShown: false }}>
        <Stack.Screen
          screenOptions={{
            gestureEnabled: false,
            swipeEnabled: false,
          }}
          name={routes.AUTHSTACK}
          component={AuthStack}
        />
        <Stack.Screen
          screenOptions={{
            gestureEnabled: false,
            swipeEnabled: false,
          }}
          name={routes.HOMESTACK}
          component={HomeStack}
        />
      </Stack.Navigator>
      <ModalAnimationHOC>
        <GeneralHocScreen />
      </ModalAnimationHOC>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
