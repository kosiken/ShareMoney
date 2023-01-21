// just a logger to log every action that happens in the redux store
export const logger = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.debug('dispatching', action);
  let result = next(action);
  console.debug('next state', store.getState());
  console.groupEnd();
  return result;
};
