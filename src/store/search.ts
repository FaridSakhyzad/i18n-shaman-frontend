import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { IKey, IKeyValue } from '../interfaces';

interface IValuesMap {
  [ keyId: string ]: {
    [languageId: string]: IKeyValue;
  }
}

interface IInitialState {
  keys: IKey[],
  keyValues: IValuesMap | null,
  loading: boolean,
}

const initialState: IInitialState = {
  keys: [],
  keyValues: null,
  loading: false,
};

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const searchSlice = createAppSlice({
  name: 'search',
  initialState,
  reducers: {
    setValues: (state, { payload }) => {
      if (payload) {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        state.keyValues = payload;
      }
    },
  },
});

export const { setValues } = searchSlice.actions;

export default searchSlice.reducer;
