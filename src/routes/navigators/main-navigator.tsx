/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import AddContacts from '../../modules/contacts/screens/AddContacts';
import {Home} from '../../modules/home';
import {HomeRoutes, HomeStack} from '../routes';
import SendMoneyToContact from '../../modules/home/screens/SendMoneyToContact';
import Header from './Header';

export const HomeNavigator = (): React.ReactElement => (
  <HomeStack.Navigator
    initialRouteName={HomeRoutes.Base}
    screenOptions={{
      header: Header,
    }}>
    <HomeStack.Screen
      name={HomeRoutes.Base}
      options={{
        gestureEnabled: false,
        headerShown: false,
      }}
      component={Home}
    />
    <HomeStack.Screen name={HomeRoutes.AddContact} component={AddContacts} />
    <HomeStack.Screen
      name={HomeRoutes.SendMoneyToContact}
      component={SendMoneyToContact}
    />
  </HomeStack.Navigator>
);
