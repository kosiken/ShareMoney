import {switchMap, filter} from 'rxjs';
import {RootEpic} from '../../store/epics';
import {isActionOf} from 'typesafe-actions';
import {navigateTo} from './actions';
import * as NavigationService from '../../routes/NavigationService';

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

const AppEpics = [navigateEpic];

export default AppEpics;
