import {createReducer} from 'typesafe-actions';
import {Actions} from '../../store/epics';
import {AppState} from '../../types';
import {putMessage} from './actions';

const rootState: AppState = {
  signingIn: false,
  loading: false,
};

const appReducer = createReducer<AppState, Actions>(rootState).handleAction(
  putMessage,
  (state, action) => {
    return {...state, errorMessage: action.payload};
  },
);

export default appReducer;
