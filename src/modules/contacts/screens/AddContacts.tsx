import {Layout, Text, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, FlatList, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Box from '../../../design-system/components/Box';
import {addShareMoneyContact, loadContacts} from '../store/actions';
import {selectOtherContacts} from '../store/selectors';

const AddContacts = () => {
  const contacts = useSelector(selectOtherContacts);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const loadMore = () => {
    dispatch(loadContacts.request(contacts.length));
  };

  useEffect(() => {
    console.log(currentIndex);
    if (currentIndex > -1) {
      const contact = contacts[currentIndex];
      Alert.alert(
        'Add to contacts',
        `Add ${contact.name} to your share money contacts`,
        [
          {
            text: 'Add',
            onPress: () => {
              setTimeout(() => {
                dispatch(addShareMoneyContact({contact, index: currentIndex}));
              }, 100);
              setCurrentIndex(-1);
            },
          },
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <Layout style={Styles.container}>
      <SafeAreaView style={Styles.container}>
        <Box flex={false} padding={[0, 10]} row right>
          <Text status="info">{contacts.length} Contacts</Text>
        </Box>
        <Box flex={1} margin={[0, 0, 5, 0]}>
          <FlatList
            scrollEnabled
            data={contacts}
            keyExtractor={(_, index) => {
              return `contact-${index}`;
            }}
            renderItem={({item, index}) => {
              return (
                <>
                  <Button
                    style={Styles.button}
                    appearance="ghost"
                    onPress={() => setCurrentIndex(index)}>
                    <Box padding={[0, 10]}>
                      <Text style={Styles.contactHeader}>{item.name}</Text>
                      <Text>{item.phone_prefix + ' ' + item.phone}</Text>
                    </Box>
                  </Button>

                  {contacts.length > 0 && index + 1 === contacts.length && (
                    <Box flex={false} margin={[10, 0]}>
                      <Button onPress={loadMore} appearance="ghost">
                        Load More
                      </Button>
                    </Box>
                  )}
                </>
              );
            }}
          />
        </Box>
      </SafeAreaView>
    </Layout>
  );
};

export default AddContacts;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  button: {
    flex: 0,
    width: '100%',
    textAlign: 'left',
  },
});
