import React, {useState} from 'react';
import {Layout, Input, Button, CheckBox, Text} from '@ui-kitten/components';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Box from '../../../design-system/components/Box';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {MainNavigationProp} from '../../../routes/types';
import {AuthRoutes} from '../../../routes/routes';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserLoading} from '../store/selectors';
import {initSignUp} from '../store/actions';
import uuid from 'react-native-uuid';

interface SignUpScreenProps {
  navigation: MainNavigationProp<AuthRoutes.Login>;
}

const SignUp: React.FC<SignUpScreenProps> = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
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
              confirmPassword: '',
              firstName: '',
              lastName: '',
              phoneNumber: '',
            }}
            onSubmit={state => {
              if (state.password !== state.confirmPassword) {
                return Alert.alert('Error', 'Passwords do not match');
              } else {
                dispatch(
                  initSignUp({
                    ...state,
                    email: state.email.toLowerCase(),
                    user_id: uuid.v4() as string,
                  }),
                );
              }
            }}
            validationSchema={Yup.object({
              firstName: Yup.string().min(3),
              lastName: Yup.string().min(3),
              email: Yup.string().email('Invalid Email').required('Required'),
              password: Yup.string()
                .min(6, 'Invalid Password')
                .required('Required'),
              confirmPassword: Yup.string()
                .min(6, 'Invalid Password')
                .required('Required'),
              phoneNumber: Yup.string()
                .min(10, 'Phone Number too short')
                .max(14, 'Phone Number too long'),
            })}>
            {props => (
              <Box padding={[0, 10]}>
                <Text style={Styles.headerText}>ShareMoney</Text>
                <Box flex={false} margin={[0, 0, 30]} />
                <Input
                  label="First Name"
                  keyboardType="default"
                  style={Styles.input}
                  onChangeText={props.handleChange('firstName')}
                  onBlur={props.handleBlur('firstName')}
                  value={props.values.firstName}
                  status={
                    props.touched.firstName && props.errors.firstName
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.firstName && !!props.errors.firstName,
                    props.errors.firstName,
                  )}
                />
                <Input
                  label="Last Name"
                  keyboardType="default"
                  style={Styles.input}
                  onChangeText={props.handleChange('lastName')}
                  onBlur={props.handleBlur('lastName')}
                  value={props.values.lastName}
                  status={
                    props.touched.lastName && props.errors.lastName
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.lastName && !!props.errors.lastName,
                    props.errors.lastName,
                  )}
                />

                <Input
                  label="Phone Number"
                  keyboardType="number-pad"
                  style={Styles.input}
                  onChangeText={props.handleChange('phoneNumber')}
                  onBlur={props.handleBlur('phoneNumber')}
                  value={props.values.phoneNumber}
                  status={
                    props.touched.phoneNumber && props.errors.phoneNumber
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.phoneNumber && !!props.errors.phoneNumber,
                    props.errors.phoneNumber,
                  )}
                />
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
                <Input
                  label="Confirm Password"
                  style={Styles.input}
                  secureTextEntry
                  onChangeText={props.handleChange('confirmPassword')}
                  onBlur={props.handleBlur('confirmPassword')}
                  value={props.values.confirmPassword}
                  status={
                    props.touched.confirmPassword &&
                    props.errors.confirmPassword
                      ? 'danger'
                      : 'basic'
                  }
                  caption={renderCaption(
                    !!props.touched.confirmPassword &&
                      !!props.errors.confirmPassword,
                    props.errors.confirmPassword,
                  )}
                />
                <Box flex={false} margin={[10, 0]}>
                  <CheckBox onChange={setChecked} checked={checked}>
                    {evaProps => (
                      <Text {...evaProps}>
                        Agree to our Terms and Conditions
                      </Text>
                    )}
                  </CheckBox>
                </Box>
                <Box flex={false} margin={[30, 0]}>
                  <Button
                    disabled={!checked || loading}
                    onPress={props.handleSubmit}>
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

export default SignUp;

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
