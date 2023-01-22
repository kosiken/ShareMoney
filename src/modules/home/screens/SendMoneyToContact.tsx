import {StyleSheet, SafeAreaView, Alert} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Input, Layout, Text, Button} from '@ui-kitten/components';
import Box from '../../../design-system/components/Box';
import {useRoute} from '@react-navigation/native';
import {ContactItem} from '../../../types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {HomeRoutes} from '../../../routes/routes';
import {MainNavigationProp} from '../../../routes/types';
import {Paystack} from 'react-native-paystack-webview';
import {useDispatch} from 'react-redux';
import {addTransactionInit} from '../../app/store/actions';

const SendMoneyToContact = () => {
  const navigation =
    useNavigation<MainNavigationProp<HomeRoutes.SendMoneyToContact>>();
  const paystackWebViewRef = useRef<any>();
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const [user, setUser] = useState<ContactItem | undefined>();
  const [amount, setAmount] = useState(0);
  const onChange = (t: string) => {
    const num = parseInt(t, 10);
    if (isNaN(num)) {
      return;
    }
    setAmount(num);
  };
  const back = (res: string) => {
    const contact = user!;
    dispatch(
      addTransactionInit({
        user: contact.name,
        amount: amount.toFixed(2),
        created_at: Date.now(),
        paystackRef: res,
      }),
    );
    navigation.goBack();
  };
  useEffect(() => {
    setUser(route.params.contact as ContactItem);
  }, [route]);
  return (
    <Layout style={styles.container}>
      <Paystack
        paystackKey={'pk_test_c62c37fcbf2efacaa0557b43007038193c3592a4'}
        billingEmail="allisonkosy@gmail.com"
        amount={amount.toFixed(2)}
        onCancel={(e: any) => {
          // handle response here
          console.log(e);
          Alert.alert('Error', "Couldn't complete payment");
        }}
        onSuccess={(res: any) => {
          // handle response here
          console.log(res.transactionRef);
          Alert.alert('Success', 'Money has been sent to ' + user!.name, [
            {
              text: 'Ok',
              onPress: () => back(res!.transactionRef!.trxref.trim()),
            },
          ]);
        }}
        ref={paystackWebViewRef}
      />
      <SafeAreaView style={styles.container}>
        <Box center middle>
          <KeyboardAwareScrollView enableOnAndroid style={styles.container}>
            <Box>
              <Text style={styles.item} status="info">
                Send NGN{amount.toFixed(2)} to {user ? user.name : 'Loading...'}
              </Text>
              <Input
                style={styles.item}
                label="Amount"
                keyboardType="number-pad"
                onChangeText={onChange}
              />
              <Button
                disabled={amount < 1}
                onPress={() => paystackWebViewRef.current.startTransaction()}
                style={styles.item}>
                Continue
              </Button>
            </Box>
          </KeyboardAwareScrollView>
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default SendMoneyToContact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    marginBottom: 10,
  },
});
