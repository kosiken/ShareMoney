import {
  combineEpics,
  Epic,
  EpicMiddleware,
  createEpicMiddleware,
} from 'redux-observable';
import {Services, RootState} from '../types';
import * as appActions from '../modules/app/store/actions';
import * as authActions from '../modules/auth/store/actions';
import * as contactsActions from '../modules/contacts/store/actions';
import {ActionType} from 'typesafe-actions';
import AppEpics from '../modules/app/store/epics';
import AuthEpics from '../modules/auth/store/epics';
import ContactEpics from '../modules/contacts/store/epics';

export type Actions =
  | ActionType<typeof appActions>
  | ActionType<typeof authActions>
  | ActionType<typeof contactsActions>;

export type RootEpic = Epic<Actions, Actions, RootState, Services>;
// tslint:disable-next-line: interface-name
interface EpicConfiguration {
  rootEpic: RootEpic;
  epicMiddleware: EpicMiddleware<Actions, Actions, RootState, Services>;
}

export const configureEpic = (services: Services): EpicConfiguration => {
  const rootEpic = combineEpics(...AppEpics, ...AuthEpics, ...ContactEpics);
  const epicMiddleware = createEpicMiddleware<
    Actions,
    Actions,
    RootState,
    Services
  >({
    dependencies: services,
  });

  return {
    rootEpic,
    epicMiddleware,
  };
};
