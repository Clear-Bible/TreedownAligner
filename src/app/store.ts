import { configureStore } from '@reduxjs/toolkit';

import AppReducer from 'app/app.slice';
import TextSegmentReducer from 'features/textSegment/textSegment.slice';
import PolyglotReducer from 'features/polyglot/polyglot.slice';

export const store = configureStore({
  reducer: {
    app: AppReducer,
    textSegment: TextSegmentReducer,
    polyglot: PolyglotReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
