import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OtpScreen from '../screens/OtpScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';
import {routes} from '../navigation/RouteNames';
import SplashScreen from '../screens/SplashScreen';
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.SPLASH_SCREEN}
      component={SplashScreen}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.LOGIN_SCREEN}
      component={LoginScreen}
    />

    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN}
      component={RegisterScreen}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.OTP_SCREEN}
      component={OtpScreen}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.RESTORE_PASSWORD_SCREEN}
      component={RestorePasswordScreen}
    />
  </Stack.Navigator>
);

export default AuthStack;
