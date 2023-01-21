import {
  StackActions,
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';

import * as React from 'react';
import {MainStackParamList} from './routes';

export const _navigator =
  React.createRef<NavigationContainerRef<MainStackParamList>>();
type NavParams = Record<string, any> | undefined;

function navigate(name: keyof MainStackParamList, params: NavParams = {}) {
  _navigator.current?.navigate(name, params as any);
}

function reset(route: keyof MainStackParamList, params: NavParams = {}) {
  _navigator.current?.dispatch({
    ...StackActions.replace(route, params),
  });
}

function resetHard(route: keyof MainStackParamList) {
  _navigator.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: route}],
    }),
  );
}

function resetStack(
  routes: Array<{name: keyof MainStackParamList; params?: NavParams}>,
  index: number,
) {
  _navigator.current?.dispatch(
    CommonActions.reset({
      index,
      routes,
    }),
  );
}
function pop() {
  const popAction = StackActions.pop(1);
  _navigator.current?.dispatch(popAction);
}

function popToTop() {
  _navigator.current?.dispatch(StackActions.popToTop());
}

export {navigate, reset, pop, popToTop, resetHard, resetStack};
