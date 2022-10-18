import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '@/_services';

export const PrivateRoute = ({ component: Component, switchDarkMode, darkMode, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = authenticationService.currentUserValue;
        // console.log('props--------', props)
        let isChangeLogin = false;
        const oldToolJetId = window.localStorage.getItem('oldtid') || '';
        let paramsObj = {};
        if (
          props.location &&
          props.location.search &&
          typeof props.location.search === 'string' &&
          props.location.search.length > 2
        ) {
          const searchText = props.location.search.slice(1);
          const paramsArr = searchText.split('&');
          paramsArr.forEach((param) => {
            if (typeof param === 'string' && param.indexOf('=')) {
              const paramArr = param.split('=');
              paramsObj[paramArr[0]] = paramArr[1];
            }
          });
          if (paramsObj.tooljetId && paramsObj.tooljetId != oldToolJetId) {
            isChangeLogin = true;
          }
        }
        // console.log('isChangeLogin-----', isChangeLogin)
        if (isChangeLogin || (!currentUser && !props.location.pathname.startsWith('/applications/'))) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{
                pathname: '/login',
                search: `?redirectTo=${props.location.pathname}&tooljetId=${paramsObj.tooljetId}&mode=${paramsObj.mode}`,
                state: { from: props.location },
              }}
            />
          );
        }

        // authorised so return component
        return <Component {...props} switchDarkMode={switchDarkMode} darkMode={darkMode} />;
      }}
    />
  );
};
