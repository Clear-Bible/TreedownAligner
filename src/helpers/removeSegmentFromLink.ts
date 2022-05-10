import { Word, InProgressLink } from 'structs';

const removeFromArray = (originArray: string[], id: string): string[] => {
  const _array = originArray.concat([]);
  const index = _array.findIndex((sourceId: string) => sourceId === id);
  _array.splice(index, 1);
  return _array;
};

const removeSegmentFromLink = (
  wordToRemove: Word,
  link: InProgressLink
): InProgressLink => {
  if (link.sources.includes(wordToRemove.id)) {
    link.sources = removeFromArray(link.sources, wordToRemove.id);
  } else if (link.targets.includes(wordToRemove.id)) {
    link.targets = removeFromArray(link.targets, wordToRemove.id);
  }

  return link;
};

export default removeSegmentFromLink;
