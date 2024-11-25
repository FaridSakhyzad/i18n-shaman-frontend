import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user';
import projectsReducer from './projects';

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
