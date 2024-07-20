import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './ui';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;
