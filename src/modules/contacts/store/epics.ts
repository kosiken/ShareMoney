import {PERMISSIONS} from 'react-native-permissions';
import {RootEpic} from '../../../store/epics';
import uuid from 'react-native-uuid';

import {isActionOf} from 'typesafe-actions';
import {
  addShareMoneyContact,
  checkContactsAccess,
  loadContacts,
  putSavedContacts,
  saveContacts,
  setLoadingContacts,
  setOthers,
} from './actions';
import {
  catchError,
  filter,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import ShareMoneyContactModule from '../../../native/contactModule';
import {getUniqueContacts} from '../../../helpers';
import {ContactItem, PermissionsEnum} from '../../../types';
import {
  checkPermissionsAccess,
  empty,
  putMessage,
} from '../../app/store/actions';
import {Platform} from 'react-native';
import {selectOtherContacts} from './selectors';

const checkContactsAccessEpic: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(checkContactsAccess)),
    switchMap(() => {
      const isIos = Platform.OS === 'ios';
      const permission = isIos
        ? PERMISSIONS.IOS.CONTACTS
        : PERMISSIONS.ANDROID.READ_CONTACTS;

      return of(
        checkPermissionsAccess.request({
          permission,
          successMessage: 'User granted permission',
          failedMessage: 'You have to grant permission',
          key: PermissionsEnum.CONTACTS,
        }),
      );
    }),
  );

const loadContactsAfterPermissionEpic: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(checkPermissionsAccess.success)),
    switchMap(({payload}) => {
      console.log('kosy is here');
      return [
        payload.key === PermissionsEnum.CONTACTS
          ? loadContacts.request(0)
          : empty(),
      ];
    }),
  );

const loadContactsEpic: RootEpic = (action$, state$, {db}) =>
  action$.pipe(
    filter(isActionOf(loadContacts.request)),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const {payload} = action;

      const length = state.contacts.contacts.length;

      if (length > 0 && !(length % 1000 === 0)) {
        return [setLoadingContacts(false)];
      }
      return forkJoin([
        ShareMoneyContactModule.loadContacts(payload),
        db.getMany<ContactItem>({}, {tableName: 'contacts'}),
      ]).pipe(
        map(([v, o]) => {
          // array comes from native code so I don't want to mutate
          console.log('mine ', v);
          let copy: ContactItem[] = [];
          const set = new Set(o.map(c => c.phone));
          const set2 = new Set();
          v.forEach(contact => {
            for (const phoneNumber of contact.phoneNumbers) {
              const phone = phoneNumber.replace(/[()\-\s]/g, '');
              if (set2.has(phone)) {
                continue;
              }
              set2.add(phone);
              copy.push({
                contact_id: phone,
                name: contact.name,
                phone: '',
                phone_prefix: 'none',
              });
            }
          });
          if (copy.length > 0) {
            copy = getUniqueContacts(copy);
            copy.sort((a, b) => a.name.localeCompare(b.name));
          }
          console.log(o[0], copy[0]);
          const res = {
            newContacts: copy.filter(c => !set.has(c.phone)),
            savedContacts: o,
            allContacts: copy,
          };
          // console.log(o.length, (copy.filter(c => !set.has(c.contact_id))).length, copy.length);
          return loadContacts.success(res);
        }),
        catchError(err => {
          return [loadContacts.failure(err.message || err.toString())];
        }),
      );
    }),
  );

const addShareMoneyContactEpic: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(addShareMoneyContact)),
    withLatestFrom(state$),
    switchMap(([{payload}, state]) => {
      const others = [...selectOtherContacts(state)];
      others.splice(payload.index, 1);
      return [
        putMessage({
          type: 'info',
          message: `${payload.contact.name} Added to verified contacts`,
        }),
        setOthers(others),
        putSavedContacts([payload.contact]),
      ];
    }),
  );

const saveContactsEpic: RootEpic = (action$, _, {db}) =>
  action$.pipe(
    filter(isActionOf(putSavedContacts)),
    switchMap(({payload}) => {
      return from(
        db.saveMany(
          payload.map(c => {
            return {...c, created_at: Date.now(), contact_id: uuid.v4()};
          }),
          {tableName: 'contacts'},
        ),
      ).pipe(
        map(() => {
          return saveContacts.success(payload);
        }),
      );
    }),
  );

const ContactEpics = [
  addShareMoneyContactEpic,
  checkContactsAccessEpic,
  loadContactsAfterPermissionEpic,
  loadContactsEpic,
  saveContactsEpic,
];

export default ContactEpics;
