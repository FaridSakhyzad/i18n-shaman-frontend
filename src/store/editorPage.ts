/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  selectedEntities: string[],
}

const initialState: IInitialState = {
  selectedEntities: [],
};

const editorPageSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setSelectedEntities: (state, { payload }) => {
      state.selectedEntities = payload;
    },
  },
});

export const { setSelectedEntities } = editorPageSlice.actions;

export default editorPageSlice.reducer;
