import {
  combineEpics,
  Epic,
  EpicMiddleware,
  createEpicMiddleware,
} from 'redux-observable';
import {Services, RootState} from '../types';
import * as appActions from '../modules/app/actions';
import {ActionType} from 'typesafe-actions';
import AppEpics from '../modules/app/epics';

export type Actions = ActionType<typeof appActions>;

export type RootEpic = Epic<Actions, Actions, RootState, Services>;
// tslint:disable-next-line: interface-name
interface EpicConfiguration {
  rootEpic: RootEpic;
  epicMiddleware: EpicMiddleware<Actions, Actions, RootState, Services>;
}

export const configureEpic = (services: Services): EpicConfiguration => {
  const rootEpic = combineEpics(...AppEpics);
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
