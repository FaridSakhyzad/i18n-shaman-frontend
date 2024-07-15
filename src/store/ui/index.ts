import { createSlice } from '@reduxjs/toolkit';

interface IInitialState {
  show: boolean
  text: string
}

const initialState: IInitialState = {
  show: true,
  text: 'ASDF 1024 x QWERTY 768',
}

const uiSlice = createSlice({
  name: 'todos',
  initialState: initialState,
  reducers: {
    uiToggle(state) {
      state.show = !state.show;
    }
  }
})

const uiToggle = uiSlice.actions.uiToggle;

export { uiToggle };

export default uiSlice.reducer