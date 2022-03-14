import undoable from 'redux-undo';

import AppReducer from 'state/app.slice';
import AlignmentReducer from 'state/alignment.slice';
import TextSegmentHoverReducer from 'state/textSegmentHover.slice';
import PolyglotReducer from 'state/polyglot.slice';

export const reducer = {
  reducer: {
    app: AppReducer,
    alignment: undoable(AlignmentReducer),
    textSegmentHover: TextSegmentHoverReducer,
    polyglot: PolyglotReducer,
  },
};

export default reducer;
