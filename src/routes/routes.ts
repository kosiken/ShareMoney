import {createStackNavigator} from '@react-navigation/stack';
import {ContactItem} from '../types';

export enum BaseRoutes {
  Splash = 'Splash',
}
export enum AuthRoutes {
  Welcome = 'Welcome',
  Login = 'Login',
  Signup = 'Signup',
}

export enum HomeRoutes {
  Base = 'Base',
  Dashboard = 'Dashboard',
  AddContact = 'AddContact',
  SendMoneyToContact = 'SendMoneyToContact',
}

export type MainStackParamList = {
  [BaseRoutes.Splash]: undefined;
  [AuthRoutes.Welcome]: undefined;
  [AuthRoutes.Login]: undefined;
  [AuthRoutes.Signup]: undefined;

  [HomeRoutes.Base]: undefined;
  [HomeRoutes.Dashboard]: undefined;
  [HomeRoutes.AddContact]: undefined;
  [HomeRoutes.SendMoneyToContact]: {contact: ContactItem};
};

export const AuthStack = createStackNavigator<MainStackParamList>();

export const HomeStack = createStackNavigator<MainStackParamList>();
