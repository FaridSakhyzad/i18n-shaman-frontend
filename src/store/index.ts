import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user';
import projectsReducer from './projects';
import searchReducer from './search';

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
    search: searchReducer,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
