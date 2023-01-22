/* eslint-disable react/no-unstable-nested-components */

import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Dashboard from './screens/Dashboard';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import ShareMoneyContacts from './screens/ShareMoneyContacts';
import Transactions from './screens/Transactions';
import {Platform} from 'react-native';

const Tabs = createBottomTabNavigator();

const MyTabBar: React.FC<BottomTabBarProps> = ({state, navigation}) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      style={{
        paddingBottom: Platform.OS === 'ios' ? 20 : 5,
      }}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab
        title="Home"
        icon={propsIcon => <Icon {...propsIcon} name={'home'} />}
      />
      <BottomNavigationTab
        title="Pay Someone"
        icon={propsIcon => <Icon {...propsIcon} name="people-outline" />}
      />
      <BottomNavigationTab
        title="Transactions"
        icon={propsIcon => <Icon {...propsIcon} name="settings-outline" />}
      />
    </BottomNavigation>
  );
};

export const Home = () => {
  return (
    <Tabs.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}>
      <Tabs.Screen name="Dashboard" component={Dashboard} />
      <Tabs.Screen name="Pay Someone" component={ShareMoneyContacts} />
      <Tabs.Screen name="Transactions" component={Transactions} />
    </Tabs.Navigator>
  );
};
