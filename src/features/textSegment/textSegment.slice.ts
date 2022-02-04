import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TextSegmentState {
  hoveredId: string | null;
  selectedTextSegments: string[];
}

const initialState: TextSegmentState = {
  hoveredId: null,
  selectedTextSegments: [],
};

const textSegmentSlice = createSlice({
  name: 'textSegment',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<string | null>) => {
      state.hoveredId = action.payload;
    },
    toggleTextSegment: (state, action: PayloadAction<string>) => {
      if (state.selectedTextSegments.includes(action.payload)) {
        state.selectedTextSegments = state.selectedTextSegments.filter(
          (id) => id !== action.payload
        );
      } else {
        state.selectedTextSegments.push(action.payload);
      }
    },
  },
});

export const { hover, toggleTextSegment } = textSegmentSlice.actions;
export default textSegmentSlice.reducer;
