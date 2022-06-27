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
  ],
};

export default alignments;
