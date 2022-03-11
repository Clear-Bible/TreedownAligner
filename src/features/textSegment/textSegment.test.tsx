import { renderWithProvider, RootState } from 'test/harness';
import preloadedState from 'test/preloadedState';

import { CorpusRole } from 'structs';
import { AlignmentMode } from 'state/alignment.slice';
import TextSegment from 'features/textSegment';

const testState: RootState = {
  ...preloadedState,
  alignment: {
    ...preloadedState.alignment,
    present: {
      alignments: [{ source: 'sbl', target: 'leb', links: [] }],
      inProgressLink: {
        source: 'sbl',
        target: 'leb',
        sources: ['sbl_0'],
        targets: [],
      },
      mode: AlignmentMode.CleanSlate,
    },
  },
};
describe('TextSegment', () => {
  it('renders without crashing', () => {
    renderWithProvider(
      <TextSegment
        word={{
          id: 'test_1',
          corpusId: 'test',
          role: CorpusRole.Source,
          text: 'mikey',
          position: 0,
        }}
      />,
      null
    );
  });

  it('is selected', () => {
    const { getByText } = renderWithProvider(
      <TextSegment
        word={{
          id: 'sbl_0',
          corpusId: 'sbl',
          role: CorpusRole.Source,
          text: 'mikey',
          position: 0,
        }}
      />,
      testState
    );
    const textSegment = getByText(/mikey/);
    expect(textSegment.style.backgroundColor).toEqual('black');
  });
});
