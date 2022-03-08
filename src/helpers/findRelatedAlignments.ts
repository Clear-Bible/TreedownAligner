import { Alignment, Word, Link } from 'structs';

// Takes an array of `Alignment` and a `Word`.
// Returns only `Alignment` items that include the word.
// `Alignment` `Link`s are filtered by relation to the word.
const findRelatedAlignments = (
  unfilteredAlignments: Alignment[],
  word: Word
): Alignment[] => {
  const filteredAlignments = unfilteredAlignments.map(
    (alignment: Alignment): Alignment | null => {
      const filteredLinks = alignment.links.filter((link: Link) => {
        return link.sources.includes(word.id) || link.targets.includes(word.id);
      });
      if (filteredLinks.length) {
        return { ...alignment, links: filteredLinks };
      }
      return null;
    }
  );

  return filteredAlignments.filter((x): x is Alignment => x !== null);
};

export default findRelatedAlignments;
