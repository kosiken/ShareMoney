import React from 'react';
import * as eva from '@eva-design/eva';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import AppNavigation from './src/routes/Navigation';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import MessageIndicator from './src/modules/app/components/MessageIndicator';
import initialzeStore from './src/store';
import {Provider} from 'react-redux';

const store = initialzeStore();
export default () => (
  <SafeAreaProvider>
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <MessageIndicator />
        <AppNavigation />
      </ApplicationProvider>
    </Provider>
  </SafeAreaProvider>
);
