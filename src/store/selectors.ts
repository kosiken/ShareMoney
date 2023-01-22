import {createSelector} from 'reselect';
import {RootState} from '../types';

const getState = (state: RootState) => state;

export const selectRootState = createSelector(getState, state => state);
