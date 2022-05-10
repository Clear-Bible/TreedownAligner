import { SyntaxRoot } from 'structs';

import treedownSyntax from 'features/treedown/treedown.json';
import markSyntax from 'features/treedown/mark-example.treedown.json';
import syntaxMapper from 'features/treedown/syntaxMapper';

describe('syntaxMapper', () => {
  it('can map a single aligned word', () => {
    const result = syntaxMapper(
      treedownSyntax as unknown as SyntaxRoot,
      {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [{ targets: ['410160010010010'], sources: ['en_6'] }],
        polarity: {
          type: 'primary',
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
      },
      null
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
        polarity: {
          type: 'primary',
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
      },
      null
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
          polarity: {
            type: 'primary',
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
        },
        null
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
          polarity: {
            type: 'primary',
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
        },
        null
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
          polarity: {
            type: 'primary',
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
        },
        null
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
          polarity: {
            type: 'primary',
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
        },
        null
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
      const result = syntaxMapper(treedownSyntax as unknown as SyntaxRoot, {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [
          {
            targets: ['410160010010010', '410160010020010'],
            sources: ['en_4'],
          },
        ],
        polarity: {
          type: 'primary',
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
      });

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
          polarity: {
            type: 'primary',
            syntaxSide: 'targets',
            nonSyntaxSide: 'sources',
          },
        },
        {
          source: 'a very good english translation',
          target: 'an excellent spanish translation',
          links: [{ targets: ['spa_2'], sources: ['en_4'] }],
          polarity: {
            type: 'secondary',
            mappedSide: 'sources',
            nonMappedSide: 'targets',
          },
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['spa_2']);
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
          polarity: {
            type: 'primary',
            syntaxSide: 'sources',
            nonSyntaxSide: 'targets',
          },
        },
        {
          source: 'leb',
          target: 'nvi',
          links: [{ sources: ['en_4'], targets: ['nvi_2'] }],
          polarity: {
            type: 'secondary',
            mappedSide: 'targets',
            nonMappedSide: 'sources',
          },
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['en_4']);
    });
  });

  describe('real life data', () => {
    it('maps primary', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          source: 'sbl',
          target: 'nvi',
          links: [
            { sources: ['450050030010010'], targets: ['nvi_1'] },
            { targets: ['nvi_2'], sources: ['450050030020010'] },
            { targets: ['nvi_0'], sources: ['450050030030010'] },
            { targets: ['nvi_5'], sources: ['450050030040010'] },
            { targets: ['nvi_6'], sources: ['450050030050010'] },
            { targets: ['nvi_7'], sources: ['450050030070010'] },
            {
              targets: ['nvi_8', 'nvi_9'],
              sources: ['450050030080010', '450050030090010'],
            },
            { targets: ['nvi_11'], sources: ['450050030100010'] },
            { targets: ['nvi_12'], sources: ['450050030110010'] },
            { targets: ['nvi_13'], sources: ['450050030120010'] },
            { targets: ['nvi_14'], sources: ['450050030130010'] },
            { targets: ['nvi_16'], sources: ['450050030140010'] },
            { targets: ['nvi_15'], sources: ['450050030150010'] },
          ],
          polarity: {
            type: 'primary',
            syntaxSide: 'sources',
            nonSyntaxSide: 'targets',
          },
        },

        null
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['nvi_0']);
    });

    it('maps secondary', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          source: 'sbl',
          target: 'nvi',
          links: [
            { sources: ['450050030010010'], targets: ['nvi_1'] },
            { targets: ['nvi_2'], sources: ['450050030020010'] },
            { targets: ['nvi_0'], sources: ['450050030030010'] },
            { targets: ['nvi_5'], sources: ['450050030040010'] },
            { targets: ['nvi_6'], sources: ['450050030050010'] },
            { targets: ['nvi_7'], sources: ['450050030070010'] },
            {
              targets: ['nvi_8', 'nvi_9'],
              sources: ['450050030080010', '450050030090010'],
            },
            { targets: ['nvi_11'], sources: ['450050030100010'] },
            { targets: ['nvi_12'], sources: ['450050030110010'] },
            { targets: ['nvi_13'], sources: ['450050030120010'] },
            { targets: ['nvi_14'], sources: ['450050030130010'] },
            { targets: ['nvi_16'], sources: ['450050030140010'] },
            { targets: ['nvi_15'], sources: ['450050030150010'] },
          ],
          polarity: {
            type: 'primary',
            syntaxSide: 'sources',
            nonSyntaxSide: 'targets',
          },
        },

        {
          source: 'leb',
          target: 'nvi',
          links: [
            { targets: ['nvi_0'], sources: ['leb_0'] },
            { targets: ['nvi_1'], sources: ['leb_1'] },
            { targets: ['nvi_2'], sources: ['leb_2'] },
            { targets: ['nvi_4'], sources: ['leb_3'] },
            { targets: ['nvi_5'], sources: ['leb_4'] },
            { targets: ['nvi_6'], sources: ['leb_6'] },
            { targets: ['nvi_7'], sources: ['leb_8'] },
            { targets: ['nvi_8', 'nvi_9'], sources: ['leb_9', 'leb_10'] },
            { targets: ['nvi_10'], sources: ['leb_11'] },
            { targets: ['nvi_11'], sources: ['leb_12', 'leb_13'] },
            { targets: ['nvi_12'], sources: ['leb_14'] },
            { targets: ['nvi_14'], sources: ['leb_15'] },
            { targets: ['nvi_15'], sources: ['leb_16'] },
            { targets: ['nvi_16'], sources: ['leb_17', 'leb_18'] },
          ],
          polarity: {
            type: 'secondary',
            mappedSide: 'targets',
            nonMappedSide: 'sources',
          },
        }
      );

      expect(
        result.children[0].children[0].children[0].content.alignedWordIds
      ).toEqual(['leb_0']);
    });
  });
});
