import {createStackNavigator} from '@react-navigation/stack';

export enum AuthRoutes {
  Welcome = 'Welcome',
  Login = 'Login',
  Signup = 'Signup',
}

export type MainStackParamList = {
  [AuthRoutes.Welcome]: undefined;
  [AuthRoutes.Login]: undefined;
  [AuthRoutes.Signup]: undefined;
};

export const MainStack = createStackNavigator<MainStackParamList>();
