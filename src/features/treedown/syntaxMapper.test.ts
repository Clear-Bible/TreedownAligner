import { SyntaxRoot } from 'structs';

import treedownSyntax from 'features/treedown/treedown.json';
import syntaxMapper from 'features/treedown/syntaxMapper';

describe('syntaxMapper', () => {
  it('can map a single aligned word', () => {
    const result = syntaxMapper(treedownSyntax as unknown as SyntaxRoot, {
      target: 'an interesting greek source',
      source: 'a very good english translation',
      links: [{ targets: ['410160010010010'], sources: ['en_6'] }],
    });

    expect(
      result.children[0].children[0].children[0].content.alignedWordIds
    ).toEqual(['en_6']);
  });

  it('can map three aligned words', () => {
    const result = syntaxMapper(treedownSyntax as unknown as SyntaxRoot, {
      target: 'an interesting greek source',
      source: 'a very good english translation',
      links: [
        { targets: ['410160010010010'], sources: ['en_4', 'en_5', 'en_7'] },
      ],
    });

    expect(
      result.children[0].children[0].children[0].content.alignedWordIds
    ).toEqual(['en_4', 'en_5', 'en_7']);
  });
});
