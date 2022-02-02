import { configureStore } from '@reduxjs/toolkit';
import TextSegmentReducer from 'features/textSegment/textSegment.slice';
import AppReducer from 'app/app.slice';

export const store = configureStore({
  reducer: { app: AppReducer, textSegment: TextSegmentReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
