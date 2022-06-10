import { Corpus } from 'structs';

import nvi from 'workbench/texts/nvi';
import leb from 'workbench/texts/leb';
import backTrans from 'workbench/texts/backTrans';

const placeholder = 'No text for this reference.';

const availableCorpora: Corpus[] = [
  {
    id: 'leb',
    name: 'LEB',
    fullName: 'Lexham English Bible',
    language: 'eng',
    words: [],
  },
  {
    id: 'nvi',
    name: 'NVI',
    fullName: 'Nueva Versión Internacional',
    language: 'spa',
    words: [],
  },
  {
    id: 'backTrans',
    name: 'BT 1',
    fullName: 'Back Translation 1',
    language: 'eng',
    words: [],
  },
];

export const queryText = (corpusId: string, osisRef: string): Corpus => {
  let text = '';

  if (corpusId === 'leb') {
    text = leb[osisRef] ?? placeholder;
  }

  if (corpusId === 'nvi') {
    text = nvi[osisRef] ?? placeholder;
  }

  if (corpusId === 'backTrans') {
    text = backTrans[osisRef] ?? placeholder;
  }

  const corpus = availableCorpora.find((corpus) => {
    return corpus.id === corpusId;
  });

  if (!corpus) {
    throw new Error(`Unable to find requested corpus: ${corpusId}`);
  }

  const words = text.split(' ').map((word: string, index: number) => {
    const id = `${corpusId}_${index}`;
    let language = '';

    return {
      id,
      corpusId: corpusId,
      position: index,
      text: word,
      language,
    };
  });

  return {
    id: corpus?.id ?? '',
    name: corpus?.name ?? '',
    fullName: corpus?.fullName ?? '',
    language: corpus?.language ?? '',
    words: words,
  };
};
