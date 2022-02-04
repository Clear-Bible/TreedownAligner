import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  debug: boolean;
}

const initialState: AppState = {
  debug: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    'debug': (state, action: PayloadAction<boolean>) => {
      state.debug = action.payload;
    }
  },
});

export const { debug } = appSlice.actions;
export default appSlice.reducer;
