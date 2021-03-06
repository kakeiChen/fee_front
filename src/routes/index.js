// We only need to import the modules necessary for initial render
import Home from './Home';
import ManageRoute from './Manage';
import DefaultRoute from './404';
import ErrorRoute from './Error';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

const createRoutes = (store) => ({
  path        : '/',
  component   : null,
  indexRoute  : Home,
  onEnter: (opts, replace, next) => {
    if (location.pathname === '/') {
      replace('/Manage/ShareList');
    }
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    ManageRoute(store),
    ErrorRoute(store),
    // this line should put at last
    DefaultRoute(store),
  ],
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
