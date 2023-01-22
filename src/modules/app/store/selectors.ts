import {createSelector} from 'reselect';
import {selectRootState} from '../../../store/selectors';
import {PermissionsEnum} from '../../../types';

export const selectAppState = createSelector(
  selectRootState,
  state => state.app,
);

export const selectMessage = createSelector(
  selectAppState,
  state => state.errorMessage,
);

export const selectPermissionState = (p: PermissionsEnum) => {
  return createSelector(selectAppState, state => {
    if (!state.permissions[p]) {
      return {
        enabled: false,
        loading: false,
        status: 'EMPTY',
      };
    } else {
      return state.permissions[p];
    }
  });
};

export const selectSigningIn = createSelector(
  selectAppState,
  state => state.signingIn,
);

export const selectTransactions = createSelector(
  selectAppState,
  state => state.transactions,
);

export const selectTransactionsLoading = createSelector(
  selectAppState,
  state => state.loadingTransactions,
);
