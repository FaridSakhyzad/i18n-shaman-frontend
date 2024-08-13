import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './ui';
import userReducer from './user';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;
