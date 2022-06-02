import { RootState } from 'test/harness';

import { AlignmentMode } from 'state/alignment.slice';

const preloadedState: RootState = {
  app: { debug: false, theme: 'day', corpusViewports: [], scrollLock: false },
  alignment: {
    past: [],
    present: {
      alignments: [],
      corpora: [],
      inProgressLink: null,
      mode: AlignmentMode.CleanSlate,
    },
    future: [],
    group: null,
    _latestUnfiltered: {
      alignments: [],
      corpora: [],
      inProgressLink: null,
      mode: AlignmentMode.CleanSlate,
    },
    index: 0,
    limit: 1,
  },
  textSegmentHover: { hovered: null, relatedAlignments: [] },
};

export default preloadedState;
