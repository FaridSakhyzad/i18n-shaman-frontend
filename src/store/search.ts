import { IKey, IKeyValue } from '../interfaces';
import { createAppSlice } from './helpers';

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

const searchSlice = createAppSlice({
  name: 'search',
  initialState,
  reducers: {
    setValues: (state, { payload }) => {
      if (payload) {
        // eslint-disable-next-line no-param-reassign
        state.keyValues = payload;
      }
    },
  },
});

export const { setValues } = searchSlice.actions;

export default searchSlice.reducer;
