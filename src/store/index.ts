import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {ToolkitStore} from '@reduxjs/toolkit/dist/configureStore';
import thunk from 'redux-thunk';
import {RootState, Services} from '../types';
import {Actions, configureEpic} from './epics';
import {logger} from './middleware';
import appReducer from '../modules/app/appReducer';
import SqlLiteApi from '../services/SqlLiteApi';

// we use this global store variable so that we can keep a reference
// to the redux store retrieve this later on for example
// in the (redux-observable) https://redux-observable.js.org/  epics
let s: ToolkitStore<RootState, Actions, any[]>;

const initialzeStore = () => {
  const rootReducer = combineReducers<RootState, Actions>({
    app: appReducer,
  });

  const services: Services = {
    db: SqlLiteApi,
    getStore: () => s,
  };
  const {rootEpic, epicMiddleware} = configureEpic(services);

  const baseMiddleWare = [thunk, logger, epicMiddleware];

  let store = configureStore<RootState, Actions, any[]>({
    reducer: rootReducer,
    middleware: baseMiddleWare,
    devTools: __DEV__,
  });
  epicMiddleware.run(rootEpic);

  /**
   *  ideally you'd want to do something like
   * let persistor = persistStore(store);
   * so that local storage logic is handled for you
   */
  s = store;
  return store;
};

export default initialzeStore;
