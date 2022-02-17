import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Text, Alignment } from 'structs';

interface PolyglotState {
  alignments: Alignment[];
  texts: Text[];
}

const initialState: PolyglotState = {
  alignments: [],
  texts: [],
};

const polyglotSlice = createSlice({
  name: 'polyglot',
  initialState,
  reducers: {
    loadTexts: (state, action: PayloadAction<Text[]>) => {
      state.texts = action.payload;
    },

    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      state.alignments = action.payload;
    },
  },
});

export const { loadAlignments, loadTexts } = polyglotSlice.actions;
export default polyglotSlice.reducer;
