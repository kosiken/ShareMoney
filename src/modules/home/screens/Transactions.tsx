import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import Box from '../../../design-system/components/Box';
import {useSelector} from 'react-redux';
import {
  selectTransactions,
  selectTransactionsLoading,
} from '../../app/store/selectors';
import {formatDate2} from '../../../helpers';

const Transactions: React.FC = () => {
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);
  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box flex={false} space="between" row padding={[20, 10]} center>
          <Text style={Styles.header}>Transactions</Text>
          {loading && <ActivityIndicator />}
        </Box>
        <Box flex={1}>
          <FlatList
            scrollEnabled
            data={transactions}
            keyExtractor={(_, index) => {
              return `share-money-transactions-${index}`;
            }}
            renderItem={({item}) => {
              return (
                <Box padding={[0, 10]} margin={[10, 0]}>
                  <Text style={Styles.contactHeader}>{item.user}</Text>
                  <Text>
                    {item.amount}{' '}
                    <Text status="info" style={Styles.price}>
                      {' '}
                      {formatDate2(item.created_at)}
                    </Text>
                  </Text>
                </Box>
              );
            }}
          />
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default Transactions;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
  },
  price: {
    fontWeight: '700',
  },

  contactHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
});
