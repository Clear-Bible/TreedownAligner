import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  debug: boolean;
  theme: 'night' | 'day';
}

const initialState: AppState = {
  debug: false,
  theme: 'night',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    debug: (state, action: PayloadAction<boolean>) => {
      state.debug = action.payload;
    },
    setTheme: (state, action: PayloadAction<'night' | 'day'>) => {
      state.theme = action.payload;
    },
  },
});

export const { debug, setTheme } = appSlice.actions;
export default appSlice.reducer;
