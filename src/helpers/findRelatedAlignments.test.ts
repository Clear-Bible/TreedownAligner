import { Alignment, Link } from 'structs';
import findRelatedAlignments from 'helpers/findRelatedAlignments';

const testAlignments: Alignment[] = [
  {
    source: 'regular',
    target: 'goofy',
    links: [
      { sources: ['regular_8'], targets: ['goofy_7'] },
      { sources: ['regular_1'], targets: ['goofy_2'] },
    ],
  },
  {
    source: 'specificThing',
    target: 'genericThing',
    links: [{ sources: ['specific_1', 'specific_2'], targets: ['generic_4'] }],
  },
];

const testWord = {
  id: 'regular_8',
  corpusId: 'regular',
  text: 'asdf',
  position: 8,
};
const testWord1 = {
  id: 'goofy_7',
  corpusId: 'regular',
  text: 'fdsa',
  position: 7,
};

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
