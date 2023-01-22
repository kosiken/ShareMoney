import React from 'react';
import {AuthRoutes, AuthStack} from '../routes';
import Signup from '../../modules/auth/screens/SignUp';
import Welcome from '../../modules/auth/screens/Welcome';
import Login from '../../modules/auth/screens/Login';
import Header from './Header';

export const AuthNavigator = (): React.ReactElement => (
  <AuthStack.Navigator
    initialRouteName={AuthRoutes.Welcome}
    screenOptions={{
      header: Header,
    }}>
    <AuthStack.Screen
      name={AuthRoutes.Welcome}
      options={{
        gestureEnabled: false,
        headerShown: false,
      }}
      component={Welcome}
    />
    <AuthStack.Screen name={AuthRoutes.Signup} component={Signup} />
    <AuthStack.Screen name={AuthRoutes.Login} component={Login} />
  </AuthStack.Navigator>
);
