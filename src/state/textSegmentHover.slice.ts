import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Alignment, Word } from 'structs';

interface TextSegmentState {
  hovered: Word | null;
  relatedAlignments: Alignment[];
}

const initialState: TextSegmentState = {
  hovered: null,
  relatedAlignments: [],
};

const textSegmentHoverSlice = createSlice({
  name: 'textSegmentHover',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<Word | null>) => {
      state.hovered = action.payload;
    },
    relatedAlignments: (state, action: PayloadAction<Alignment[]>) => {
      state.relatedAlignments = action.payload;
    },
  },
});

export const { hover, relatedAlignments } = textSegmentHoverSlice.actions;
export default textSegmentHoverSlice.reducer;
