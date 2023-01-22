import {createAction, createAsyncAction} from 'typesafe-actions';
import {User} from '../../../types';

type SignUpPayload = User & {password: string};

export const initAction = createAction('SHARE_MONEY/USER/INIT')();

export const initSignUp = createAction(
  'SHARE_MONEY/USER/SIGN_UP',
)<SignUpPayload>();

export const userSignInAction = createAsyncAction(
  'SHARE_MONEY/USER/SIGN_IN/REQUEST',
  'SHARE_MONEY/USER/SIGN_IN/SUCCESS',
  'SHARE_MONEY/USER/SIGN_IN/FAIL',
)<{email: string; password: string}, User, string>();

export const userSignUpRequestAction = createAsyncAction(
  'SHARE_MONEY/USER/SIGN_UP/REQUEST',
  'SHARE_MONEY/USER/SIGN_UP/SUCCESS',
  'SHARE_MONEY/USER/SIGN_UP/FAIL',
)<SignUpPayload, User, string>();

export const userFetchData = createAsyncAction(
  'SHARE_MONEY/USER/FETCH_DATA/REQUEST',
  'SHARE_MONEY/USER/FETCH_DATA/SUCCESS',
  'SHARE_MONEY/USER/FETCH_DATA/FAIL',
)<string, User, string>();

export const userSignOutRequestAction = createAsyncAction(
  'SHARE_MONEY/USER/SIGN_OUT/REQUEST',
  'SHARE_MONEY/USER/SIGN_OUT/SUCCESS',
  'SHARE_MONEY/USER/SIGN_OUT/FAIL',
)<void, void, string>();
