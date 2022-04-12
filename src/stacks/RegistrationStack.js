import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OtpScreen from '../screens/OtpScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';
import {routes} from '../navigation/RouteNames';
import SplashScreen from '../screens/SplashScreen';
import RegistrationStep1 from '../screens/registration/RegistrationStep1';
import RegistrationStep2 from '../screens/registration/RegistrationStep2';
import RegistrationStep3 from '../screens/registration/RegistrationStep3';
import {CardStyleInterpolators} from '@react-navigation/stack';
import RegistrationStep4 from '../screens/registration/RegistrationStep4';
import RegistrationStep5 from '../screens/registration/RegistrationStep5';
const Stack = createNativeStackNavigator();

const RegistrationStack = () => (
  <Stack.Navigator
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN}
      component={RegisterScreen}
    />

    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN_STEP_1}
      component={RegistrationStep1}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN_STEP_2}
      component={RegistrationStep2}
    />

    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN_STEP_3}
      component={RegistrationStep3}
    />

    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN_STEP_4}
      component={RegistrationStep4}
    />
    <Stack.Screen
      options={{headerShown: false}}
      name={routes.REGISTER_SCREEN_STEP_5}
      component={RegistrationStep5}
    />
  </Stack.Navigator>
);

export default RegistrationStack;
