import {createReducer} from 'typesafe-actions';
import {ContactsState} from '../../../types';

import {Actions} from '../../../store/epics';
import {
  loadContacts,
  putSavedContacts,
  setLoadingContacts,
  setOthers,
} from './actions';

const rootState: ContactsState = {
  contacts: [],
  registeredContacts: [],
  loadingContacts: false,
  hasContactsAccess: false,
};

const contactsReducer = createReducer<ContactsState, Actions>(rootState)
  .handleAction(loadContacts.request, state => {
    return {...state, loadingContacts: true};
  })
  .handleAction(setLoadingContacts, (state, {payload}) => {
    return {...state, loadingContacts: payload};
  })
  .handleAction(
    loadContacts.success,
    (state, {payload: {newContacts: contacts, savedContacts}}) => {
      return {
        ...state,
        contacts,
        registeredContacts: savedContacts,
        loadingContacts: false,
      };
    },
  )
  .handleAction(putSavedContacts, (state, {payload}) => {
    return {
      ...state,
      loadingContacts: false,
      registeredContacts: state.registeredContacts.concat(payload),
    };
  })
  .handleAction(setOthers, (state, {payload}) => {
    return {
      ...state,
      contacts: payload,
    };
  });

export default contactsReducer;
