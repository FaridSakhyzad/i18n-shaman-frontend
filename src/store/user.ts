/* eslint-disable no-param-reassign */
import { buildCreateSlice, asyncThunkCreator, createAsyncThunk } from '@reduxjs/toolkit';
import { verifyUser, setLanguage } from 'api/user';

interface ISettings {
  language: string | null,
}

interface IInitialState {
  id: string | null;
  login: string | null;
  loading: boolean;
  settings: ISettings;
}

const initialState: IInitialState = {
  id: null,
  login: null,
  loading: true,
  settings: {
    language: null,
  },
};

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export const restoreSession = createAsyncThunk(
  'user/restoreSession',
  async () => {
    const res = await verifyUser();

    return res;
  },
);

interface ISetUserLanguageInputArgs {
  userId: string;
  language: string
}

export const setUserLanguage = createAsyncThunk(
  'user/setUserLanguage',
  async (data: ISetUserLanguageInputArgs) => {
    const { userId, language } = data;

    const res = await setLanguage(userId, language);

    return res;
  },
);

const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        const { id, login } = action.payload;

        state.loading = false;
        state.id = id;
        state.login = login;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(setUserLanguage.pending, (state) => {
        state.loading = true;
      })
      .addCase(setUserLanguage.fulfilled, (state, action) => {
        console.log(action.payload);

        state.loading = false;
      })
      .addCase(setUserLanguage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
