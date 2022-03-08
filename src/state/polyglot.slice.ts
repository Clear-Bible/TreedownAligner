import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Corpus, Alignment } from 'structs';

interface PolyglotState {
  alignments: Alignment[];
  corpora: Corpus[];
}

const initialState: PolyglotState = {
  alignments: [],
  corpora: [],
};

const polyglotSlice = createSlice({
  name: 'polyglot',
  initialState,
  reducers: {
    loadCorpora: (state, action: PayloadAction<Corpus[]>) => {
      state.corpora = action.payload;
    },

    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      state.alignments = action.payload;
    },
  },
});

export const { loadAlignments, loadCorpora } = polyglotSlice.actions;
export default polyglotSlice.reducer;
