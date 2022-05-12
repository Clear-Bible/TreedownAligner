import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CorpusViewport } from 'structs';

interface AppState {
  debug: boolean;
  theme: 'night' | 'day';
  corpusViewports: CorpusViewport[];
}

const initialState: AppState = {
  debug: false,
  theme: 'night',
  corpusViewports: [],
};

const CORPUS_VIEWPORT_MAX = 4;
const CORPUS_VIEWPORT_MIN = 1;

interface AddCorpusRequest {
  // Corpus IDs that do not have a current viewport
  availableCorpora: string[];
}

interface ChangeCorpusRequest {
  viewportIndex: number;
  newViewport: CorpusViewport;
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    debug: (state, action: PayloadAction<boolean>) => {
      state.debug = action.payload;
    },
    setTheme: (state, action: PayloadAction<'night' | 'day'>) => {
      state.theme = action.payload;
    },
    addCorpusViewport: (state, action: PayloadAction<AddCorpusRequest>) => {
      if (state.corpusViewports.length < CORPUS_VIEWPORT_MAX) {
        if (action.payload.availableCorpora.length > 0) {
          state.corpusViewports = state.corpusViewports.concat({
            corpusId: action.payload.availableCorpora[0],
          });
          return;
        }

        state.corpusViewports.push({ corpusId: null });
      }
    },
    removeCorpusViewport: (state) => {
      if (state.corpusViewports.length > 0) {
        state.corpusViewports = state.corpusViewports.slice(
          0,
          state.corpusViewports.length - 1
        );
      }
    },
    changeCorpusViewport: (
      state,
      action: PayloadAction<ChangeCorpusRequest>
    ) => {
      state.corpusViewports[action.payload.viewportIndex] =
        action.payload.newViewport;
    },
  },
});

export const {
  debug,
  setTheme,
  addCorpusViewport,
  removeCorpusViewport,
  changeCorpusViewport,
} = appSlice.actions;
export default appSlice.reducer;
