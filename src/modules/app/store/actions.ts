import {createAction, createAsyncAction} from 'typesafe-actions';
import {MessageVariant, PermissionsEnum, Transaction} from '../../../types';

export const clearMessage = createAction('SHARE_MONEY/APP/CLEAR_MESSAGE')();

export const putMessage = createAction('SHARE_MONEY/APP/PUT_MESSAGE')<
  string | {type: MessageVariant; message: string; title?: string},
  any
>();

export const navigateTo = createAction('SHARE_MONEY/APP/NAVIGATE')<{
  route: string;
  reset: boolean;
  hardReset?: string;
  params?: Record<string, any>;
}>();
export const empty = createAction('SHARE_MONEY/APP/EMPTY')();

export const checkPermissionsAccess = createAsyncAction(
  'SHARE_MONEY/APP/CHECK_PERMISSIONS/REQUEST',
  'SHARE_MONEY/APP/CHECK_PERMISSIONS/SUCCESS',
  'SHARE_MONEY/APP/CHECK_PERMISSIONS/FAILURE',
)<
  {
    successMessage: string;
    failedMessage: string;
    permission: string;
    key: PermissionsEnum;
  },
  {key: PermissionsEnum; message?: string; enabled: boolean},
  {key: PermissionsEnum; message: string; enabled: boolean}
>();

export const addTransactionInit = createAction(
  'SHARE_MONEY/APP/ADD_TRANSACTION_INIT',
)<Transaction>();

export const addTransaction = createAction('SHARE_MONEY/APP/ADD_TRANSACTION')<
  Transaction[]
>();

export const fetchTransactions = createAction(
  'SHARE_MONEY/APP/FETCH_TRANSACTIONS',
)();
