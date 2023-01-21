import {createAction} from 'typesafe-actions';

export const clearMessage = createAction('SHARE_MONEY/APP/CLEAR_MESSAGE')();

export const putMessage = createAction('SHARE_MONEY/APP/PUT_MESSAGE')<
  | string
  | {type: 'success' | 'error' | 'info'; message: string; title?: string},
  any
>();

export const navigateTo = createAction('SHARE_MONEY/APP/NAVIGATE')<{
  route: string;
  reset: boolean;
  hardReset?: string;
  params?: Record<string, any>;
}>();
