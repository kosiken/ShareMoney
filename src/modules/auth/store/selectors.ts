import {createSelector} from 'reselect';
import {selectRootState} from '../../../store/selectors';

export const selectAuthState = createSelector(
  selectRootState,
  state => state.auth,
);

export const selectUser = createSelector(selectAuthState, state => state.user);

export const selectUserLoading = createSelector(
  selectAuthState,
  state => state.loading,
);
