import {StackNavigationProp} from '@react-navigation/stack';
import {AuthRoutes, MainStackParamList} from './routes';

export type MainNavigationProp<
  RouteName extends keyof MainStackParamList = AuthRoutes,
> = StackNavigationProp<MainStackParamList, RouteName>;
