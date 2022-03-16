import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Corpus, CorpusViewType } from 'structs';

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
      state.corpora = action.payload.map((corpus: Corpus) => {
        const viewType = corpus.viewType
          ? corpus.viewType
          : CorpusViewType.Paragraph;

        return { ...corpus, viewType };
      });
    },
    toggleCorpusView: (state, action: PayloadAction<string>) => {
      const corpusIndex = state.corpora.findIndex(
        (corpus) => corpus.id === action.payload
      );
      const oldViewType = state.corpora[corpusIndex].viewType;
      const newViewType =
        oldViewType === CorpusViewType.Paragraph
          ? CorpusViewType.Treedown
          : CorpusViewType.Paragraph;

      state.corpora[corpusIndex].viewType = newViewType;
    },
  },
});

export const { loadCorpora, toggleCorpusView } = polyglotSlice.actions;
export default polyglotSlice.reducer;
