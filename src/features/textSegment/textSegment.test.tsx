import { renderWithProvider } from 'test/harness';

import { CorpusRole } from 'structs';
import TextSegment from 'features/textSegment';

describe('TextSegment', () => {
  it('renders', () => {
    renderWithProvider(
      <TextSegment
        word={{
          id: 'test_1',
          corpusId: 'test',
          role: CorpusRole.Source,
          text: 'mikey',
          position: 0,
        }}
      />
    );
  });
});
