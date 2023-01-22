import {NativeModules} from 'react-native';
import {Contact} from '../types';
const {ShareMoneyContactModule} = NativeModules;

interface ContactInterface {
  loadContacts: (offset: number) => Promise<Contact[]>;
}

export default ShareMoneyContactModule as ContactInterface;
