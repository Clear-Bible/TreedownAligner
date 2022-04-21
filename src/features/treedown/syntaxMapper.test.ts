import { SyntaxRoot } from 'structs';

import treedownSyntax from 'features/treedown/treedown.json';
import syntaxMapper from 'features/treedown/syntaxMapper';

describe('syntaxMapper', () => {
  it('can map a single aligned word', () => {
    const result = syntaxMapper(
      treedownSyntax as unknown as SyntaxRoot,
      {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [{ targets: ['410160010010010'], sources: ['en_6'] }],
      },
      null,
      {
        primary: {
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
        secondary: {},
      }
    );

    expect(
      result.children[0].children[0].children[0].content.alignedWordIds
    ).toEqual(['en_6']);
  });

  it('can map three aligned words', () => {
    const result = syntaxMapper(
      treedownSyntax as unknown as SyntaxRoot,
      {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [
          { targets: ['410160010010010'], sources: ['en_4', 'en_5', 'en_7'] },
        ],
      },
      null,
      {
        primary: {
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
        secondary: {},
      }
    );

    expect(
      result.children[0].children[0].children[0].content.alignedWordIds
    ).toEqual(['en_4', 'en_5', 'en_7']);
  });

  describe('link refactoring', () => {
    it('refactors many:many links into 1:many (symmetric)', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: [
                '410160010010010',
                '410160010020010',
                '410160010030010',
              ],
              sources: ['en_4', 'en_5', 'en_7'],
            },
          ],
        },
        null,
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
          secondary: {},
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[1].children[0].content
          .alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[1].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_7']);
    });

    it('refactors many:many links into 1:many (asymmetric)', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: [
                '410160010010010',
                '410160010020010',
                '410160010030010',
              ],
              sources: ['en_4', 'en_5', 'en_7', 'en_8'],
            },
          ],
        },
        null,
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
          secondary: {},
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[1].children[0].content
          .alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[1].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_7', 'en_8']);
    });

    it('refactors many:many links into 1:many (asymmetric surplus)', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: [
                '410160010010010',
                '410160010020010',
                '410160010030010',
              ],
              sources: ['en_4', 'en_5', 'en_7', 'en_8'],
            },
          ],
        },
        null,
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
          secondary: {},
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[1].children[0].content
          .alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[1].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_7', 'en_8']);
    });

    it('refactors many:many links into 1:many (asymmetric deficit)', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: [
                '410160010010010',
                '410160010020010',
                '410160010030010',
              ],
              sources: ['en_4', 'en_5'],
            },
          ],
        },
        null,
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
          secondary: {},
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[1].children[0].content
          .alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[1].children[1].children[0]
          .content.alignedWordIds
      ).toEqual([]);
    });

    it('does not duplicate 1 many:1 link to multiple', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['410160010010010', '410160010020010'],
              sources: ['en_4'],
            },
          ],
        },
        null,
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
          secondary: {},
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[1].children[0].content
          .alignedWordIds
      ).toEqual([]);
    });
  });

  describe('mapping secondary alignments', () => {
    it('secondarily maps a single word', () => {
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['410160010010010', '410160010020010'],
              sources: ['en_4'],
            },
          ],
        },
        {
          source: 'a very good english translation',
          target: 'an excellent spanish translation',
          links: [{ targets: ['spa_2'], sources: ['en_4'] }],
        },
        {
          primary: {
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },

          secondary: {
            mappedSide: 'sources',
            nonMappedSide: 'targets',
          },
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['spa_2']);

      //expect(
      //result.children[0].children[0].children[1].children[0].content
      //.alignedWordIds
      //).toEqual([undefined]);
    });

    it('secondarily maps a single word (reversed)', () => {
      // Greek (ms) <> Spanish (trans) <> English (lwc)
      const result = syntaxMapper(
        treedownSyntax as unknown as SyntaxRoot,
        {
          source: 'nestle1904',
          target: 'nvi',
          links: [
            {
              sources: ['410160010010010', '410160010020010'],
              targets: ['nvi_2'],
            },
          ],
        },
        {
          source: 'leb',
          target: 'nvi',
          links: [{ sources: ['en_4'], targets: ['nvi_2'] }],
        },
        {
          primary: {
            syntaxSide: 'sources',
            nonSyntaxSide: 'targets',
          },

          secondary: {
            mappedSide: 'targets',
            nonMappedSide: 'sources',
          },
        }
      );

      console.log(result.children[0].children[0].children[0]);
      // console.log(JSON.stringify(result, null, 2));
      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['nvi_2']);
    });
  });
});
