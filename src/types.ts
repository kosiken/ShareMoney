import {Store} from 'redux';
import { Persistence } from './services/persistence';

export interface Contact {
  id?: string;
  name: string;
  phoneNumbers: string[];
}

export interface ContactItem {
  name: string;
  phone: string;
  phone_prefix: string;
  contact_id: string;
}

export interface AppState {
  loading: boolean;
  signingIn: boolean;
}

export interface ContactsState {
  contacts: ContactItem[];
  finovoContacts: ContactItem[];
  loadingContacts: boolean;
  hasContactsAccess: boolean;
}

export interface User {
  id: number | string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
}

export interface RootState {
  app: AppState;
//   contacts: ContactsState;
}

export interface Services {
  db: Persistence;
  getStore: () => Store<RootState>;
}
