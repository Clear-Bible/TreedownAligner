import { RootState } from 'test/harness';

import { AlignmentMode } from 'state/alignment.slice';

const preloadedState: RootState = {
  app: { debug: false },
  alignment: {
    past: [],
    present: {
      alignments: [],
      inProgressLink: null,
      mode: AlignmentMode.CleanSlate,
    },
    future: [],
    group: null,
    _latestUnfiltered: {
      alignments: [],
      inProgressLink: null,
      mode: AlignmentMode.CleanSlate,
    },
    index: 0,
    limit: 1,
  },
  textSegmentHover: { hovered: null, relatedAlignments: [] },
  polyglot: { corpora: [] },
};

export default preloadedState;
