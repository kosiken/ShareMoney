import {createSelector} from 'reselect';
import {selectRootState} from '../../../store/selectors';

export const selectContactsState = createSelector(
  selectRootState,
  state => state.contacts,
);

export const selectShareMonetContacts = createSelector(
  selectContactsState,
  state => state.registeredContacts,
);

export const selectOtherContacts = createSelector(
  selectContactsState,
  state => state.contacts,
);

export const selectContactsLoading = createSelector(
  selectContactsState,
  state => state.loadingContacts,
);
