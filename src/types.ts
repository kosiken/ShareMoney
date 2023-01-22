import {Store} from 'redux';
import {Persistence} from './services/persistence';

export enum PermissionsEnum {
  CONTACTS = 'Contacts',
}
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

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  user_id?: string;
  password?: string;
}

export interface AuthState {
  user?: User;
  loading: boolean;
}

export type MessageVariant = 'success' | 'danger' | 'info';
export interface AppState {
  loading: boolean;
  signingIn: boolean;
  errorMessage?:
    | string
    | {type: MessageVariant; message: string; title?: string};
  permissions: Record<
    PermissionsEnum,
    {enabled: boolean; loading: boolean; status?: string}
  >;
  transactions: Transaction[];
  loadingTransactions: boolean;
}

export interface Transaction {
  amount: string;
  created_at: Date | number;
  user: string;
  owner?: string;
  paystackRef: string;
}

export interface ContactsState {
  contacts: ContactItem[];
  registeredContacts: ContactItem[];
  loadingContacts: boolean;
  hasContactsAccess: boolean;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
  contacts: ContactsState;
}

export interface Services {
  db: Persistence;
  getStore: () => Store<RootState>;
}
