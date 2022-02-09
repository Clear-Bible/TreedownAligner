import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Text } from 'structs';

interface PolyglotState {
  texts: Text[];
}

const initialState: PolyglotState = {
  texts: [],
};

const polyglotSlice = createSlice({
  name: 'polyglot',
  initialState,
  reducers: {
    loadTexts: (state, action: PayloadAction<Text[]>) => {
      state.texts = action.payload;
    },
  },
});

export const { loadTexts } = polyglotSlice.actions;
export default polyglotSlice.reducer;
