import { configureStore } from '@reduxjs/toolkit';

import appReducer from './app';
import userReducer from './user';
import projectsReducer from './projects';
import searchReducer from './search';
import systemNotificationsSlice from './systemNotifications';
import globalMessagesSlice from './globalMessages';

import editorPageSlice from './editorPage';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    projects: projectsReducer,
    search: searchReducer,
    systemNotifications: systemNotificationsSlice,
    globalMessages: globalMessagesSlice,
    editorPage: editorPageSlice,
  },
});

export default store;

export type IRootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
