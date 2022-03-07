import { Alignment, Link } from 'structs';
import findRelatedAlignments from 'helpers/findRelatedAlignments';

const testAlignments: Alignment[] = [
  {
    text1: 'regular',
    text2: 'goofy',
    links: [
      { text1: ['regular_8'], text2: ['goofy_7'] },
      { text1: ['regular_1'], text2: ['goofy_2'] },
    ],
  },
  {
    text1: 'specificThing',
    text2: 'genericThing',
    links: [{ text1: ['specific_1', 'specific_2'], text2: ['generic_4'] }],
  },
];

const testWord = { id: 'regular_8', text: 'asdf', position: 8 };
const testWord1 = { id: 'goofy_7', text: 'fdsa', position: 7 };

describe('findRelatedAlignments', () => {
  it('filters Alignment by Word', () => {
    expect(testAlignments.length).toBe(2);
    const filteredAlignments = findRelatedAlignments(testAlignments, testWord);
    expect(filteredAlignments.length).toBe(1);
  });

  it('filters Link by Word', () => {
    const filteredAlignments = findRelatedAlignments(testAlignments, testWord);
    expect(filteredAlignments[0].links.length).toBe(1);
  });
});
