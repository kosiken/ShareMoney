import {createReducer} from 'typesafe-actions';
import {Actions} from '../../../store/epics';
import {AuthState} from '../../../types';
import {
  initSignUp,
  userFetchData,
  userSignOutRequestAction,
  userSignUpRequestAction,
} from './actions';

const rootState: AuthState = {
  loading: false,
};

const authReducer = createReducer<AuthState, Actions>(rootState)
  .handleAction(
    [userSignUpRequestAction.success, userFetchData.success],
    (state, action) => {
      return {
        loading: false,
        user: action.payload,
      };
    },
  )
  .handleAction(
    [userSignOutRequestAction.failure, userSignOutRequestAction.success],
    () => ({loading: false}),
  )
  .handleAction(
    [
      userSignUpRequestAction.request,
      userFetchData.request,
      initSignUp,
      userSignOutRequestAction.request,
    ],
    state => ({
      ...state,
      loading: true,
    }),
  )
  .handleAction(
    [userSignUpRequestAction.failure, userFetchData.failure],
    state => ({
      ...state,
      loading: false,
    }),
  );

export default authReducer;
