/* eslint-disable import/no-dynamic-require */
import CoreLayout from '../../layouts/CoreLayout';
import { injectReducer } from '../../store/reducers';
import Home from '../Home';
import ShareList from './ShareList';
import ShareDetail from './ShareDetail';
import Evaluate from './Evaluate';


export const createRoutes = (store) => ({
  path        : '/Manage',
  component   : CoreLayout,
  indexRoute  : Home,
  onEnter: (opts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    ShareList(store),
    ShareDetail(store),
    Evaluate(store),
  ],
});

export function createChildRoutes(moduleName, id) {
  let path = moduleName;
  if (id) {
    path = `${moduleName}/:id`;
  }
  return (store) => ({
    path,
    onEnter: (opts, replace, next) => {
      next();
    },
    onLeave: () => {
    },
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        const container = require(`./${moduleName}/containers/index`).default;
        const reducer = require(`./${moduleName}/modules/index`).default;
        injectReducer(store, { key: moduleName, reducer });
        cb(null, container);
      });
    },
  });
}


export default createRoutes;
