import {isActionOf} from 'typesafe-actions';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import {RootEpic} from '../../../store/epics';
import {
  initAction,
  userFetchData,
  userSignUpRequestAction,
  initSignUp,
  userSignOutRequestAction,
  userSignInAction,
} from './actions';
import {forkJoin, from} from 'rxjs';
import * as localStorage from '../../../services/localStorage';
import {navigateTo, putMessage} from '../../app/store/actions';
import {User} from '../../../types';
import uuid from 'react-native-uuid';

const initAuthEpic: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(initAction)),
    switchMap(() => {
      return from(localStorage.getFromAsyncStorage('user')).pipe(
        map(ans => {
          if (ans === 'No user') {
            return userFetchData.failure('');
          }
          return userFetchData.request(ans);
        }),
      );
    }),
  );

const userSignInEpic: RootEpic = (action$, _, {db}) =>
  action$.pipe(
    filter(isActionOf(userSignInAction.request)),
    switchMap(({payload}) => {
      return from(
        db.getOne<User>(
          {
            email: payload.email,
          },
          {tableName: 'share_money_users'},
        ),
      ).pipe(
        switchMap(ans => {
          if (!ans || ans.password !== payload.password) {
            return [
              putMessage({
                type: 'danger',
                message: 'Invalid details',
              }),

              userSignInAction.failure('Invalid details'),
            ];
          }
          localStorage.storeInAsyncStorage('user', payload.email);

          return [userFetchData.success(ans!)];
        }),
      );
    }),
  );

const userSignOutEpic: RootEpic = (action$, _) =>
  action$.pipe(
    filter(isActionOf(userSignOutRequestAction.request)),
    switchMap(() => {
      return from(localStorage.clearToken()).pipe(
        switchMap(() => {
          return [
            userSignOutRequestAction.success(),
            navigateTo({
              route: 'Auth' as any,
              reset: true,
            }),
          ];
        }),
        catchError(() => {
          return [
            putMessage({
              type: 'danger',
              message: 'An error occurred',
            }),
            userSignOutRequestAction.failure('An error occurred'),
            navigateTo({
              route: 'Auth' as any,
              reset: true,
            }),
          ];
        }),
      );
    }),
  );

const initSignUpEpic: RootEpic = (action$, _, {db}) =>
  action$.pipe(
    filter(isActionOf(initSignUp)),
    switchMap(({payload}) => {
      return from(
        db.getOne({email: payload.email}, {tableName: 'share_money_users'}),
      ).pipe(
        switchMap(res => {
          if (res) {
            return [
              userSignUpRequestAction.failure('error'),
              putMessage({
                type: 'danger',
                message:
                  'A user with ' +
                  payload.email +
                  ' already registered locally',
              }),
            ];
          }
          return [userSignUpRequestAction.request(payload)];
        }),
      );
    }),
  );

const fetchUserDataEpic: RootEpic = (action$, _, {db}) =>
  action$.pipe(
    filter(isActionOf(userFetchData.request)),
    switchMap(({payload}) => {
      return from(
        db.getOne<User>(
          {
            email: payload,
          },
          {tableName: 'share_money_users'},
        ),
      ).pipe(
        map(res => {
          if (res) {
            return userFetchData.success(res);
          } else {
            throw new Error('No user found');
          }
        }),
        catchError(err => {
          console.log(err);
          return [userFetchData.failure('')];
        }),
      );
    }),
  );

const signUpEpic: RootEpic = (action$, _, {db}) =>
  action$.pipe(
    filter(isActionOf(userSignUpRequestAction.request)),
    switchMap(({payload}) => {
      return forkJoin([
        db.saveMany(
          [
            {
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              phoneNumber: payload.phoneNumber,
              password: payload.password,
              created_at: Date.now(),
              user_id: payload.user_id || (uuid.v4() as string),
            },
          ],
          {
            tableName: 'share_money_users',
          },
        ),
        localStorage.storeInAsyncStorage('user', payload.email),
      ]).pipe(
        switchMap(() => {
          return [
            navigateTo({
              route: 'Home',
              reset: true,
            }),
            userSignUpRequestAction.success({
              ...payload,
              password: undefined,
            } as any),
          ];
        }),
        catchError(err => {
          console.log(err);
          return [userSignUpRequestAction.failure('')];
        }),
      );
    }),
  );

const AuthEpics = [
  initAuthEpic,
  userSignOutEpic,
  initSignUpEpic,
  fetchUserDataEpic,
  userSignInEpic,
  signUpEpic,
];

export default AuthEpics;
