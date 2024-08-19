import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './ui';
import userReducer from './user';
import projectsReducer from './projects';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    projects: projectsReducer,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
