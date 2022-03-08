import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Corpus } from 'structs';

interface PolyglotState {
  corpora: Corpus[];
}

const initialState: PolyglotState = {
  corpora: [],
};

const polyglotSlice = createSlice({
  name: 'polyglot',
  initialState,
  reducers: {
    loadCorpora: (state, action: PayloadAction<Corpus[]>) => {
      state.corpora = action.payload;
    },
  },
});

export const { loadCorpora } = polyglotSlice.actions;
export default polyglotSlice.reducer;
