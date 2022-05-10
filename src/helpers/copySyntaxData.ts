import { Corpus } from 'structs';

const copySyntaxData = (corpora: Corpus[]) => {
  return corpora.map((corpus) => {
    if (corpus.syntax) {
      return { ...corpus, syntax: JSON.parse(JSON.stringify(corpus.syntax)) };
    }
    return corpus;
  });
};

export default copySyntaxData;
