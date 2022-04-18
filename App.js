import * as React from 'react';
import {View, Text, LogBox} from 'react-native';
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
let Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

export const store = createStore(
  AppReducers,
  compose(applyMiddleware(ReduxThunk)),
);

function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={routes.AUTHSTACK} component={AuthStack} />
            <Stack.Screen name={routes.HOMESTACK} component={HomeStack} />
          </Stack.Navigator>
          <ModalAnimationHOC>
            <GeneralHocScreen />
          </ModalAnimationHOC>
        </NavigationContainer>
      </Provider>
    </>
  );
}

export default App;
