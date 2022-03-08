import { Word } from 'structs';

import alignmentSliceReducer, {
  createLink,
  initialState,
} from 'state/alignment.slice';

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

describe('alignmentSlice reducer', () => {
  it('adds first link based on selected text segments', () => {
    const previousState = {
      ...initialState,
      selectedTextSegments: [sourceWord2, targetWord1],
    };

    const resultState = alignmentSliceReducer(previousState, createLink());
    console.log(resultState);
  });
});
