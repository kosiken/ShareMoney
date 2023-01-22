import React, {useEffect, useState} from 'react';
import {Layout, Button, Text} from '@ui-kitten/components';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import Box from '../../../design-system/components/Box';
import {useSelector} from 'react-redux';
import {
  selectContactsLoading,
  selectShareMonetContacts,
} from '../../contacts/store/selectors';
import {useNavigation} from '@react-navigation/native';
import {HomeRoutes} from '../../../routes/routes';
import {MainNavigationProp} from '../../../routes/types';

const ShareMoneyContacts = () => {
  const navigation = useNavigation<MainNavigationProp<HomeRoutes.Base>>();
  const contacts = useSelector(selectShareMonetContacts);
  const loading = useSelector(selectContactsLoading);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const goToAdd = () => {
    navigation.navigate(HomeRoutes.AddContact);
  };

  useEffect(() => {
    if (currentIndex > -1) {
      navigation.navigate(HomeRoutes.SendMoneyToContact, {
        contact: contacts[currentIndex],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);
  const renderContacts = () => {
    if (contacts.length === 0) {
      return (
        <Box flex={1} middle center>
          <View>
            <Text>No Contacts on Share Money</Text>
            <Box flex={false} margin={[10, 0]} />
            <Button onPress={goToAdd}> Add Contacts </Button>
          </View>
        </Box>
      );
    }

    return (
      <Box flex={1}>
        <FlatList
          scrollEnabled
          data={contacts}
          keyExtractor={(_, index) => {
            return `share-money-contact-${index}`;
          }}
          renderItem={({item, index}) => {
            return (
              <Button
                style={Styles.button}
                appearance="ghost"
                onPress={() => setCurrentIndex(index)}>
                <Box padding={[0, 10]}>
                  <Text style={Styles.contactHeader}>{item.name}</Text>
                  <Text>{item.phone_prefix + ' ' + item.phone}</Text>
                </Box>
              </Button>
            );
          }}
        />
      </Box>
    );
  };
  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box flex={false} space="between" row padding={10} center>
          <Text style={Styles.header}>Verified Contacts</Text>

          {loading && <ActivityIndicator />}

          <Button appearance="ghost" onPress={goToAdd}>
            Add More
          </Button>
        </Box>
        {renderContacts()}
      </SafeAreaView>
    </Layout>
  );
};

export default ShareMoneyContacts;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
  },

  contactHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  button: {
    flex: 0,
    width: '100%',
    textAlign: 'left',
  },
});
