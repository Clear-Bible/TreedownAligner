import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Word } from 'structs';

interface TextSegmentState {
  hoveredId: string | null;
  selectedTextSegments: Word[];
}

const initialState: TextSegmentState = {
  hoveredId: null,
  selectedTextSegments: [],
};

const textSegmentSlice = createSlice({
  name: 'textSegment',
  initialState,
  reducers: {
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
    resetTextSegments: (state) => {
      state.selectedTextSegments = [];
    },
  },
});

export const { toggleTextSegment, resetTextSegments } =
  textSegmentSlice.actions;
export default textSegmentSlice.reducer;
