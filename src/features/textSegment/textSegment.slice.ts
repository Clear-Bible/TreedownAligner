import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextSegmentState {
  hoveredId: string | null;
}

const initialState: TextSegmentState = {
  hoveredId: null,
};

const textSegmentSlice = createSlice({
  name: 'textSegment',
  initialState,
  reducers: {
    'hover': (state, action: PayloadAction<string|null>) => {
      state.hoveredId = action.payload;
    }
  },
});

export const { hover } = textSegmentSlice.actions;
export default textSegmentSlice.reducer;
