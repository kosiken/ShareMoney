import {createAction, createAsyncAction} from 'typesafe-actions';
import {ContactItem} from '../../../types';

export const loadContacts = createAsyncAction(
  'SHARE_MONEY/APP/LOAD_CONTACTS/REQUEST',
  'SHARE_MONEY/APP/LOAD_CONTACTS/SUCCESS',
  'SHARE_MONEY/APP/LOAD_CONTACTS/FAILURE',
)<
  number,
  {
    newContacts: ContactItem[];
    savedContacts: ContactItem[];
    allContacts: ContactItem[];
  },
  string
>();

export const checkContactsAccess = createAction(
  'SHARE_MONEY/APP/CHECK_CONTACTS',
)<never>();

export const setLoadingContacts = createAction(
  'SHARE_MONEY/APP/SET_CONTACTS_ACCESS',
)<boolean>();

export const putSavedContacts = createAction(
  'SHARE_MONEY/APP/PUT_SAVED_CONTACTS',
)<ContactItem[]>();

export const saveContacts = createAsyncAction(
  'SHARE_MONEY/APP/SAVE_CONTACTS/REQUEST',
  'SHARE_MONEY/APP/SAVE_CONTACTS/SUCCESS',
  'SHARE_MONEY/APP/SAVE_CONTACTS/FAILURE',
)<{others: ContactItem[]}, ContactItem[], string>();

export const addShareMoneyContact = createAction(
  'SHARE_MONEY/APP/ADD_SAVED_CONTACT',
)<{contact: ContactItem; index: number}>();

export const setOthers = createAction('SHARE_MONEY/APP/SET_OTHER_CONTACTS')<
  ContactItem[]
>();
