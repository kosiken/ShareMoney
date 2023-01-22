import React, {useEffect} from 'react';
import {
  PERMISSIONS,
  RESULTS,
  request,
  Permission,
} from 'react-native-permissions';
import {Layout, Button, Text} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView, Platform, Alert} from 'react-native';
import Box from '../../../design-system/components/Box';
import {useDispatch, useSelector} from 'react-redux';
import {checkContactsAccess} from '../../contacts/store/actions';
import {selectPermissionState} from '../../app/store/selectors';
import {PermissionsEnum} from '../../../types';
import {
  checkPermissionsAccess,
  fetchTransactions,
} from '../../app/store/actions';
import {userSignOutRequestAction} from '../../auth/store/actions';
import {selectUser} from '../../auth/store/selectors';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {enabled, status, loading} = useSelector(
    selectPermissionState(PermissionsEnum.CONTACTS),
  );
  const user = useSelector(selectUser);

  const signOut = () => {
    Alert.alert('Sign out', 'Confirm that you want to sign out', [
      {
        text: 'Cancel',
      },
      {
        text: 'Continue',
        onPress: () => dispatch(userSignOutRequestAction.request()),
      },
    ]);
  };
  useEffect(() => {
    if (user) {
      dispatch(checkContactsAccess());
      dispatch(fetchTransactions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (enabled) {
      return;
    }
    if (!enabled && status !== 'EMPTY' && !loading) {
      console.log('Data opened');
      const isIos = Platform.OS === 'ios';
      const permission: Permission = isIos
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;
      request(permission, {
        title: 'Access Contacts',
        message:
          'Sharemoney needs to read your contacts to show your friends who also use sharemoney',
        buttonPositive: 'Ok',
      }).then(value => {
        if (value === RESULTS.GRANTED || value === RESULTS.LIMITED) {
          dispatch(
            checkPermissionsAccess.success({
              key: PermissionsEnum.CONTACTS,
              enabled: true,
            }),
          );
        }
      });
    }
  }, [enabled, status, loading, dispatch]);
  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box center middle>
          <Text>{enabled + ' ' + status}</Text>
          <Button onPress={signOut}>Sign Out</Button>
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default Dashboard;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
