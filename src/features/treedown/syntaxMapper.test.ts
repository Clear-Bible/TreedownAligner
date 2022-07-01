import { SyntaxRoot } from 'structs';

import markSyntax from 'features/treedown/mark-example.treedown.json';
import romansSyntax from 'features/treedown/romans-example.treedown.json';
import genSyntax from 'features/treedown/genesis-example.treedown.json';
import syntaxMapper from 'features/treedown/syntaxMapper';

describe('syntaxMapper', () => {
  it('can map a single aligned word', () => {
    const result = syntaxMapper(
      markSyntax as unknown as SyntaxRoot,
      {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [{ targets: ['n41016001001'], sources: ['en_6'] }],
        polarity: {
          type: 'primary',
          syntaxSide: 'targets',
          nonSyntaxSide: 'sources',
        },
      },
      null
    );

    expect(
      result.children[0].children[0].children[0].children[0].content
        .alignedWordIds
    ).toEqual(['en_6']);
  });

  it('can map three aligned words', () => {
    const result = syntaxMapper(
      markSyntax as unknown as SyntaxRoot,
      {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [
          { targets: ['n41016001001'], sources: ['en_4', 'en_5', 'en_7'] },
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
      result.children[0].children[0].children[0].children[0].content
        .alignedWordIds
    ).toEqual(['en_4', 'en_5', 'en_7']);
  });

  describe('link refactoring', () => {
    it('refactors many:many links into 1:many (symmetric)', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['n41016001001', 'n41016001002', 'n41016001003'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[0].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[0].children[1].children[1]
          .children[0].content.alignedWordIds
      ).toEqual(['en_7']);
    });

    it('refactors many:many links into 1:many (asymmetric)', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['n41016001001', 'n41016001002', 'n41016001003'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[0].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[0].children[1].children[1]
          .children[0].content.alignedWordIds
      ).toEqual(['en_7', 'en_8']);
    });

    it('refactors many:many links into 1:many (asymmetric surplus)', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['n41016001001', 'n41016001002', 'n41016001003'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[0].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[0].children[1].children[1]
          .children[0].content.alignedWordIds
      ).toEqual(['en_7', 'en_8']);
    });

    it('refactors many:many links into 1:many (asymmetric deficit)', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['n41016001001', 'n41016001002', 'n41016001003'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[0].children[1].children[0]
          .content.alignedWordIds
      ).toEqual(['en_5']);

      expect(
        result.children[0].children[0].children[0].children[1].children[1]
          .children[0].content.alignedWordIds
      ).toEqual([]);
    });

    it('does not duplicate 1 many:1 link to multiple', () => {
      const result = syntaxMapper(markSyntax as unknown as SyntaxRoot, {
        target: 'an interesting greek source',
        source: 'a very good english translation',
        links: [
          {
            targets: ['n41016001001', 'n41016001002'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);

      expect(
        result.children[0].children[0].children[0].children[1].children[0]
          .content.alignedWordIds
      ).toEqual([]);
    });
  });

  describe('mapping secondary alignments', () => {
    it('secondarily maps a single word', () => {
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          target: 'an interesting greek source',
          source: 'a very good english translation',
          links: [
            {
              targets: ['n41016001001', 'n41016001002'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['spa_2']);
    });

    it('secondarily maps a single word (reversed)', () => {
      // Greek (ms) <> Spanish (trans) <> English (lwc)
      const result = syntaxMapper(
        markSyntax as unknown as SyntaxRoot,
        {
          source: 'nestle1904',
          target: 'nvi',
          links: [
            {
              sources: ['n41016001001', 'n41016001002'],
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['en_4']);
    });
  });

  describe('real life data', () => {
    it('maps primary', () => {
      const result = syntaxMapper(
        romansSyntax as unknown as SyntaxRoot,
        {
          source: 'sbl',
          target: 'nvi',
          links: [
            { sources: ['n45005003001'], targets: ['nvi_1'] },
            { targets: ['nvi_2'], sources: ['n45005003002'] },
            { targets: ['nvi_0'], sources: ['n45005003003'] },
            { targets: ['nvi_5'], sources: ['n45005003004'] },
            { targets: ['nvi_6'], sources: ['n45005003005'] },
            { targets: ['nvi_7'], sources: ['n45005003007'] },
            {
              targets: ['nvi_8', 'nvi_9'],
              sources: ['n45005003008', 'n45005003009'],
            },
            { targets: ['nvi_11'], sources: ['n45005003010'] },
            { targets: ['nvi_12'], sources: ['n45005003011'] },
            { targets: ['nvi_13'], sources: ['n45005003012'] },
            { targets: ['nvi_14'], sources: ['n45005003013'] },
            { targets: ['nvi_16'], sources: ['n45005003014'] },
            { targets: ['nvi_15'], sources: ['n45005003015'] },
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['nvi_0']);
    });

    it('maps secondary', () => {
      const result = syntaxMapper(
        romansSyntax as unknown as SyntaxRoot,
        {
          source: 'sbl',
          target: 'nvi',
          links: [
            { sources: ['n45005003001'], targets: ['nvi_1'] },
            { targets: ['nvi_2'], sources: ['n45005003002'] },
            { targets: ['nvi_0'], sources: ['n45005003003'] },
            { targets: ['nvi_5'], sources: ['n45005003004'] },
            { targets: ['nvi_6'], sources: ['n45005003005'] },
            { targets: ['nvi_7'], sources: ['n45005003007'] },
            {
              targets: ['nvi_8', 'nvi_9'],
              sources: ['n45005003008', 'n45005003009'],
            },
            { targets: ['nvi_11'], sources: ['n45005003010'] },
            { targets: ['nvi_12'], sources: ['n45005003011'] },
            { targets: ['nvi_13'], sources: ['n45005003012'] },
            { targets: ['nvi_14'], sources: ['n45005003013'] },
            { targets: ['nvi_16'], sources: ['n45005003014'] },
            { targets: ['nvi_15'], sources: ['n45005003015'] },
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
        result.children[0].children[0].children[0].children[0].content
          .alignedWordIds
      ).toEqual(['leb_0']);
    });

    it('maps secondary (multiple words)', () => {
      const result = syntaxMapper(
        genSyntax as unknown as SyntaxRoot,
        {
          source: 'oshb',
          target: 'nvi',
          links: [
            { sources: ['o010010010011'], targets: ['nvi_1'] },
            { sources: ['o010010010012'], targets: ['nvi_2', 'nvi_3'] },
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
            { sources: ['leb_0'], targets: ['nvi_1'] },
            { sources: ['leb_1', 'leb_2'], targets: ['nvi_2', 'nvi_3'] },
          ],
          polarity: {
            type: 'secondary',
            mappedSide: 'targets',
            nonMappedSide: 'sources',
          },
        }
      );

      expect(
        result.children[0].children[0].children[0].children[1].content
          .alignedWordIds
      ).toEqual(['leb_1', 'leb_2']);
    });
  });
});
