import { configureStore } from '@reduxjs/toolkit';
import undoable from 'redux-undo';

import AppReducer from 'state/app.slice';
import AlignmentReducer from 'state/alignment.slice';
import TextSegmentHoverReducer from 'state/textSegmentHover.slice';
import PolyglotReducer from 'state/polyglot.slice';

export const store = configureStore({
  reducer: {
    app: AppReducer,
    alignment: undoable(AlignmentReducer),
    textSegmentHover: TextSegmentHoverReducer,
    polyglot: PolyglotReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
