import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux';
Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'ShareMoney',
  }) // controls connection & communication settings
  .useReactNative()
  .use(reduxPlugin()) // add all built-in react native plugins
  .connect(); // let's connect!
