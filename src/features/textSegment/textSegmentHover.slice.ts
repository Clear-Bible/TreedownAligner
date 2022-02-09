import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Word } from 'structs';

interface TextSegmentState {
  hoveredId: string | null;
}

const initialState: TextSegmentState = {
  hoveredId: null,
};

const textSegmentHoverSlice = createSlice({
  name: 'textSegmentHover',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<string | null>) => {
      state.hoveredId = action.payload;
    },
  },
});

export const { hover } = textSegmentHoverSlice.actions;
export default textSegmentHoverSlice.reducer;
