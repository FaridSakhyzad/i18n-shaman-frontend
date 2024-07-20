import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  show: boolean
  text: string
}

const initialState: IInitialState = {
  show: true,
  text: 'ASDF 1024 x QWERTY 768',
};

const uiSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    uiToggle(state) {
      // eslint-disable-next-line no-param-reassign
      state.show = !state.show;
    },
  },
});

const { uiToggle } = uiSlice.actions;

export { uiToggle };

export default uiSlice.reducer;
