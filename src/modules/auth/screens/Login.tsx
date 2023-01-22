import React from 'react';
import {Layout, Input, Button, Text} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView, View, ActivityIndicator} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Box from '../../../design-system/components/Box';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {MainNavigationProp} from '../../../routes/types';
import {AuthRoutes} from '../../../routes/routes';
import {useDispatch, useSelector} from 'react-redux';
import {userSignInAction} from '../store/actions';
import {selectUserLoading} from '../store/selectors';

interface LoginScreenProps {
  navigation: MainNavigationProp<AuthRoutes.Login>;
}
const Login: React.FC<LoginScreenProps> = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectUserLoading);
  const renderCaption = (error: boolean, text?: string) => {
    if (!error) {
      return <View />;
    }
    return <Text style={Styles.captionText}>{text}</Text>;
  };
  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <KeyboardAwareScrollView enableOnAndroid style={Styles.container}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={values => {
              dispatch(userSignInAction.request(values));
            }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid Email').required('Required'),
              password: Yup.string()
                .min(6, 'Invalid Password')
                .required('Required'),
            })}>
            {props => (
              <Box padding={[0, 10]}>
                <Text style={Styles.headerText}>ShareMoney</Text>
                <Box flex={false} margin={[0, 0, 30]} />
                <Input
                  label="Email"
                  keyboardType="email-address"
                  style={Styles.input}
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  status={
                    props.touched.email && props.errors.email
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.email && !!props.errors.email,
                    props.errors.email,
                  )}
                />
                <Input
                  label="Password"
                  style={Styles.input}
                  secureTextEntry
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  status={
                    props.touched.password && props.errors.password
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.password && !!props.errors.password,
                    props.errors.password,
                  )}
                />
                <Box flex={false} margin={[30, 0]}>
                  <Button disabled={loading} onPress={props.handleSubmit}>
                    {loading ? <ActivityIndicator /> : <Text>Submit</Text>}
                  </Button>
                </Box>
              </Box>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Layout>
  );
};

export default Login;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    marginVertical: 30,
    textAlign: 'center',
    fontWeight: '800',
  },
  input: {
    marginBottom: 10,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F9BB3',
  },
});
