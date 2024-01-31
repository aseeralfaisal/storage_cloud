'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from "./store/store";

const ReduxProvider: React.FC = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;

