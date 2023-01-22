import {switchMap, filter, map, from, withLatestFrom} from 'rxjs';
import {RootEpic} from '../../../store/epics';
import {isActionOf} from 'typesafe-actions';
import uuid from 'react-native-uuid';

import {
  addTransaction,
  addTransactionInit,
  checkPermissionsAccess,
  fetchTransactions,
  navigateTo,
} from './actions';
import * as NavigationService from '../../../routes/NavigationService';
import {check, RESULTS, Permission} from 'react-native-permissions';
import {selectTransactions} from './selectors';
import {Transaction} from '../../../types';
import {selectUser} from '../../auth/store/selectors';

const navigateEpic: RootEpic = actions$ =>
  actions$.pipe(
    filter(isActionOf(navigateTo)),
    switchMap(({payload}) => {
      // console.log(payload.route + ' navigating');
      if (payload.hardReset) {
        NavigationService.resetHard(payload.hardReset as any);
      } else if (payload.reset) {
        NavigationService.reset(payload.route as any, payload.params);
      } else {
        NavigationService.navigate(payload.route as any, payload.params);
      }
      return [];
    }),
  );

const addTransactionEpic: RootEpic = (action$, state$, {db}) =>
  action$.pipe(
    filter(isActionOf(addTransactionInit)),
    withLatestFrom(state$),
    switchMap(([{payload}, state]) => {
      const transactions: Transaction[] = selectTransactions(state);
      return from(
        db.saveMany(
          [
            {
              ...payload,
              owner: state.auth.user?.user_id,
              transaction_id: uuid.v4(),
            },
          ],
          {
            tableName: 'share_money_transactions',
          },
        ),
      ).pipe(
        map(() => {
          return addTransaction(transactions.concat([payload]));
        }),
      );
    }),
  );

const fetchTransactionsEpic: RootEpic = (action$, state$, {db}) =>
  action$.pipe(
    filter(isActionOf(fetchTransactions)),
    withLatestFrom(state$),
    switchMap(([_, state]) => {
      const senator = selectUser(state);
      return from(
        db.getMany<Transaction>(
          {
            owner: senator!.user_id!,
          },
          {tableName: 'share_money_transactions'},
        ),
      ).pipe(
        map(res => {
          console.log('Transactions', res);
          return addTransaction(res);
        }),
      );
    }),
  );

const checkPermissionsAccessEpic: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(checkPermissionsAccess.request)),
    switchMap(({payload}) => {
      return from(check(payload.permission as Permission)).pipe(
        map(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              return checkPermissionsAccess.failure({
                message: payload.failedMessage,
                key: payload.key,
                enabled: false,
              });

            case RESULTS.DENIED:
              return checkPermissionsAccess.failure({
                message: payload.failedMessage,
                key: payload.key,
                enabled: false,
              });
            // 'The permission has not been requested / is denied but requestable',

            case RESULTS.LIMITED:
              return checkPermissionsAccess.success({
                key: payload.key,
                enabled: true,
              });

            case RESULTS.GRANTED:
              return checkPermissionsAccess.success({
                key: payload.key,
                enabled: true,
              });

            case RESULTS.BLOCKED:
              return checkPermissionsAccess.failure({
                message: payload.failedMessage,
                key: payload.key,
                enabled: false,
              });
          }
        }),
      );
    }),
  );
const AppEpics = [
  navigateEpic,
  fetchTransactionsEpic,
  checkPermissionsAccessEpic,
  addTransactionEpic,
];

export default AppEpics;
