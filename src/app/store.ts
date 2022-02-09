import { configureStore } from '@reduxjs/toolkit';
import undoable, { excludeAction } from 'redux-undo';

import AppReducer from 'app/app.slice';
import TextSegmentReducer from 'features/textSegment/textSegment.slice';
import TextSegmentHoverReducer from 'features/textSegment/textSegmentHover.slice';
import PolyglotReducer from 'features/polyglot/polyglot.slice';

export const store = configureStore({
  reducer: {
    app: AppReducer,
    textSegment: undoable(TextSegmentReducer),
    textSegmentHover: TextSegmentHoverReducer,
    polyglot: PolyglotReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
