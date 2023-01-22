import {createReducer} from 'typesafe-actions';
import {Actions} from '../../../store/epics';
import {AppState} from '../../../types';
import {initAction, userFetchData} from '../../auth/store/actions';
import {
  addTransaction,
  checkPermissionsAccess,
  fetchTransactions,
  putMessage,
} from './actions';

const rootState: AppState = {
  signingIn: true,
  loading: false,
  permissions: {} as any,
  transactions: [],
  loadingTransactions: false,
};

const appReducer = createReducer<AppState, Actions>(rootState)
  .handleAction(putMessage, (state, action) => {
    return {...state, errorMessage: action.payload};
  })
  .handleAction(addTransaction, (state, {payload}) => {
    return {
      ...state,
      transactions: payload,
      loadingTransactions: false,
    };
  })
  .handleAction(fetchTransactions, state => ({
    ...state,
    loadingTransactions: true,
  }))
  .handleAction(checkPermissionsAccess.request, (state, {payload}) => {
    return {
      ...state,
      permissions: {
        ...state.permissions,
        [payload.key]: {
          loading: true,
          enabled: false,
        },
      },
    };
  })
  .handleAction([userFetchData.request, initAction], state => ({
    ...state,
    signingIn: true,
  }))
  .handleAction([userFetchData.failure, userFetchData.success], state => ({
    ...state,
    signingIn: false,
  }))
  .handleAction(
    [checkPermissionsAccess.success, checkPermissionsAccess.failure],
    (state, {payload}) => {
      return {
        ...state,
        permissions: {
          ...state.permissions,
          [payload.key]: {
            loading: false,
            enabled: payload.enabled,
            status: payload.message,
          },
        },
      };
    },
  );

export default appReducer;
