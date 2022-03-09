import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Word, Alignment, Link, CorpusRole } from 'structs';

import findWordById from 'helpers/findWord';

interface AlignmentState {
  alignments: Alignment[];
  selectedTextSegments: Word[];
}

export const initialState: AlignmentState = {
  alignments: [],
  selectedTextSegments: [],
};

const alignmentSlice = createSlice({
  name: 'alignment',
  initialState,
  reducers: {
    loadAlignments: (state, action: PayloadAction<Alignment[]>) => {
      state.alignments = action.payload;
    },
    toggleTextSegment: (state, action: PayloadAction<Word>) => {
      const alreadySelected = Boolean(
        state.selectedTextSegments.find((word: Word) => {
          return word.id === action.payload.id;
        })
      );
      if (alreadySelected) {
        state.selectedTextSegments = state.selectedTextSegments.filter(
          (word) => word.id !== action.payload.id
        );
      } else {
        state.selectedTextSegments.push(action.payload);
      }
    },

    toggleAllLinkSegments: (state, action: PayloadAction<Word[]>) => {
      for (const word of action.payload) {
        state.selectedTextSegments.push(word);
      }
    },
    resetTextSegments: (state) => {
      state.selectedTextSegments = [];
    },

    createLink: (state) => {
      const sources = state.selectedTextSegments.filter(
        (word) => word.role === CorpusRole.Source
      );
      const sourceIds = sources.map((word) => word.id);

      const targets = state.selectedTextSegments.filter(
        (word) => word.role === CorpusRole.Target
      );

      const targetIds = targets.map((word) => word.id);

      const newLink: Link = { sources: sourceIds, targets: targetIds };

      state.alignments
        .find(
          (alignment) =>
            alignment.source === sources[0].corpusId &&
            alignment.target === targets[0].corpusId
        )
        ?.links.push(newLink);

      state.selectedTextSegments = [];
    },

    //selectAllSegmentsForLink: (state, action: PayloadAction<Link>) => {

    //},
  },
});

export const {
  loadAlignments,
  toggleTextSegment,
  toggleAllLinkSegments,
  resetTextSegments,
  createLink,
} = alignmentSlice.actions;

export default alignmentSlice.reducer;
