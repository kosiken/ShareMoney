/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView, ActivityIndicator} from 'react-native';
import Box from '../../../design-system/components/Box';
import {useSelector, useDispatch} from 'react-redux';
import {selectSigningIn} from '../store/selectors';
import {selectUser, selectUserLoading} from '../../auth/store/selectors';
import {initAction} from '../../auth/store/actions';
import {MainNavigationProp} from '../../../routes/types';
import {BaseRoutes} from '../../../routes/routes';

interface SplashScreenProps {
  navigation: MainNavigationProp<BaseRoutes.Splash>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const signingIn = useSelector(selectUserLoading);
  const loading = useSelector(selectSigningIn);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(initAction());
  }, []);
  useEffect(() => {
    console.log('ran', signingIn, loading);
    if (!signingIn && !loading) {
      if (user) {
        console.log(user);
        navigation.navigate('Home' as any);
      } else {
        navigation.navigate('Auth' as any);
      }
    }
  }, [signingIn, loading, user]);

  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box center middle>
          <Box flex={false} padding={20}>
            <ActivityIndicator />
            <Box margin={[10, 0]} />
            <Text>Loading... </Text>
          </Box>
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default SplashScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
