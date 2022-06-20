import { Alignment } from 'structs';

const alignments: Record<string, Alignment[]> = {
  baseOT: [
    {
      source: 'leb',
      target: 'nvi',
      links: [],
      polarity: {
        type: 'secondary',
        mappedSide: 'targets',
        nonMappedSide: 'sources',
      },
    },
    {
      source: 'oshb',
      target: 'nvi',
      links: [],
      polarity: {
        type: 'primary',
        syntaxSide: 'sources',
        nonSyntaxSide: 'targets',
      },
    },
  ],
  baseNT: [
    {
      source: 'leb',
      target: 'nvi',
      links: [],
      polarity: {
        type: 'secondary',
        mappedSide: 'targets',
        nonMappedSide: 'sources',
      },
    },
    {
      source: 'nestle1904',
      target: 'nvi',
      links: [],
      polarity: {
        type: 'primary',
        syntaxSide: 'sources',
        nonSyntaxSide: 'targets',
      },
    },
  ],

  // 'Gen.1.1.': '',
  // 'Gen.1.2.': '',
  // 'Gen.1.3.': '',
  // 'Mark.16.1': '',
  'Rom.5.3': [
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
    },
    {
      source: 'nestle1904',
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
  ],
};

export default alignments;
