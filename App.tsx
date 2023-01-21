import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout, Button} from '@ui-kitten/components';

export default () => (
  <ApplicationProvider {...eva} theme={eva.dark} >
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button>HOME</Button>
    </Layout>
  </ApplicationProvider>
);
