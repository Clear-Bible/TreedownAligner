import { configureStore } from '@reduxjs/toolkit';
import TextSegmentReducer from 'features/textSegment/textSegment.slice';

export const store = configureStore({
  reducer: { textSegment: TextSegmentReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
