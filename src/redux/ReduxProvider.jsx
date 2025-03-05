import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

/**
 * A component that provides the Redux store to its children.
 * Use this component to wrap any component that needs access to the Redux store
 * but is being rendered outside of the normal component tree (e.g., in portals).
 */
export const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
