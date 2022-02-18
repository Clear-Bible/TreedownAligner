import { Alignment, Word, Link } from 'structs';

const findRelatedAlignments = (
  allAlignments: Alignment[],
  word: Word
): Alignment[] => {
  const filteredAlignments = allAlignments.map(
    (alignment: Alignment): Alignment | null => {
      const filteredLinks = alignment.links.filter((link: Link) => {
        return link.text1.includes(word.id) || link.text2.includes(word.id);
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
