import { Corpus, Word } from 'structs';

export const findWordById = (corpora: Corpus[], wordId: string) => {
  for (const corpus of corpora) {
    const found = corpus?.words.find((word: Word) => {
      return word.id === wordId;
    });

    if (Boolean(found)) {
      return found;
    }
  }
  return undefined;
};

export default findWordById;
