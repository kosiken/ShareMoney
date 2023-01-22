import React from 'react';
import {Layout, Button} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView} from 'react-native';
import Box from '../../../design-system/components/Box';
import {MainNavigationProp} from '../../../routes/types';
import {AuthRoutes} from '../../../routes/routes';
import {useNavigation} from '@react-navigation/native';

interface LoginScreenProps {
  navigation: MainNavigationProp<AuthRoutes.Welcome>;
}
const Welcome: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<MainNavigationProp<AuthRoutes.Welcome>>();
  const continueToNext = (v: string) => {
    navigation.navigate(v as any);
  };
  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box middle center>
          <Box flex={false}>
            <Button
              onPress={continueToNext.bind(null, AuthRoutes.Login)}
              style={Styles.btn}>
              Login
            </Button>
            <Button
              onPress={continueToNext.bind(null, AuthRoutes.Signup)}
              style={Styles.btn}>
              SignUp
            </Button>
          </Box>
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default Welcome;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    marginBottom: 10,
  },
});
