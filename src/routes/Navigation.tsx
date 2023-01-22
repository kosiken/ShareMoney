import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {_navigator} from './NavigationService';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {AuthNavigator} from './navigators/auth-navigator';
import {HomeNavigator} from './navigators/main-navigator';
import SplashScreen from '../modules/app/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = (): React.ReactElement => {
  return (
    <NavigationContainer ref={_navigator}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Home" component={HomeNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
