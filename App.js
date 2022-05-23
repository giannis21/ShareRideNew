import * as React from 'react';
import {View, Text, LogBox, AppState} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStack from './src/stacks/AuthStack';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {routes} from './src/navigation/RouteNames';
//import MainTabStack from './src/stacks/MainTabStack';
import HomeStack from './src/stacks/MainTabStack';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import AppReducers from './src/configureStore';
import ModalAnimationHOC from './src/components/HOCS/ModalAnimationHOC';
import GeneralHocScreen from './src/screens/GeneralHocScreen';
import {getValue, keyNames} from './src/utils/Storage';
import {UPDATE_USER} from './src/actions/types';
import PushNotification from 'react-native-push-notification';
let Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

const rootReducer = (state, action) => {
  //if the user logs out i need to reset all the redux state
  if (action.type === 'USER_LOGOUT') {
    return AppReducers(undefined, action);
  }

  return AppReducers(state, action);
};

export const store = createStore(
  rootReducer,
  compose(applyMiddleware(ReduxThunk)),
);

const createChannel = () => {
  PushNotification.createChannel({
    channelId: 'share',
    channelName: 'ShareRide',
  });
};

function App() {
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
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

    store.dispatch({type: UPDATE_USER, payload: updatedValues});
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
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
      </NavigationContainer>
    </Provider>
  );
}

export default App;
