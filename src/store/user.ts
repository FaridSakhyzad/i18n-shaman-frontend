import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { verifyUser } from 'api/user';

interface IInitialState {
  id: string | null;
  login: string | null;
  loading: boolean;
}

const initialState: IInitialState = {
  id: null,
  login: null,
  loading: true,
};

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const userSlice = createAppSlice({
  name: 'user',
  initialState,
  reducers: (create) => ({
    restoreSession: create.asyncThunk(
      async () => {
        const res = await verifyUser();

        return res;
      },
      {
        pending: (state) => {
          // eslint-disable-next-line no-param-reassign
          state.loading = true;
        },
        rejected: (state) => {
          // eslint-disable-next-line no-param-reassign
          state.loading = false;
        },
        fulfilled: (state, { payload }) => {
          const { id, login } = payload;

          // eslint-disable-next-line no-param-reassign
          state.loading = false;
          state.id = id;
          state.login = login;
        },
      },
    ),
  }),
});

const { restoreSession } = userSlice.actions;

export { restoreSession };

export default userSlice.reducer;
