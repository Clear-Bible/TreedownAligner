import { Word, Alignment } from 'structs';

import alignmentSliceReducer, {
  createLink,
  initialState,
} from 'state/alignment.slice';

const englishAlignment: Alignment = { source: 'sbl', target: 'leb', links: [] };
const spanishAlignment: Alignment = { source: 'sbl', target: 'nvi', links: [] };

const sourceWord1: Word = {
  id: 'sbl_0',
  corpusId: 'sbl',
  text: '',
  position: 0,
};
const sourceWord2: Word = {
  id: 'sbl_1',
  corpusId: 'sbl',
  text: '',
  position: 1,
};

const targetWord1: Word = {
  id: 'leb_1',
  corpusId: 'leb',
  text: '',
  position: 1,
};
const targetWord2: Word = {
  id: 'leb_2',
  corpusId: 'leb',
  text: '',
  position: 2,
};

const otherTargetWord1: Word = {
  id: 'nvi_1',
  corpusId: 'nvi',
  text: '',
  position: 1,
};

describe('alignmentSlice reducer', () => {
  it('adds first link based on selected text segments (sbl => leb)', () => {
    const previousState = {
      ...initialState,
      alignments: [englishAlignment],
      selectedTextSegments: [sourceWord2, targetWord1],
    };

    const resultState = alignmentSliceReducer(previousState, createLink());

    expect(resultState.alignments[0].links.length).toBe(1);
    expect(resultState.alignments[0].source).toBe('sbl');
    expect(resultState.alignments[0].target).toBe('leb');
    expect(resultState.alignments[0].links[0]).toEqual({
      sources: ['sbl_1'],
      targets: ['leb_1'],
    });
  });

  it('adds first link based on selected text segments (sbl => nvi)', () => {
    const previousState = {
      ...initialState,
      alignments: [spanishAlignment],
      selectedTextSegments: [sourceWord2, otherTargetWord1],
    };

    const resultState = alignmentSliceReducer(previousState, createLink());

    expect(resultState.alignments[0].links.length).toBe(1);
    console.log(resultState.alignments[0]);
    expect(resultState.alignments[0].source).toBe('sbl');
    expect(resultState.alignments[0].target).toBe('nvi');
    expect(resultState.alignments[0].links[0]).toEqual({
      sources: ['sbl_1'],
      targets: ['nvi_1'],
    });
  });
});
