import { Corpus, SyntaxType } from 'structs';

//const copySyntaxData = (corpora: Corpus[]): Corpus[] => {
//const corpusWithSyntax = corpora.find((corpus: Corpus): boolean => {
//return Boolean(corpus.syntax);
//});

//return corpora.map((corpus: Corpus): Corpus => {
//if (corpusWithSyntax && corpus.id !== corpusWithSyntax.id) {
//const copiedSyntax = JSON.parse(JSON.stringify(corpusWithSyntax.syntax));

//return {
//...corpus,
//syntax: copiedSyntax,
//};
//}
//return corpus;
//});
//};
//
//
const copySyntaxData = (corpora: Corpus[]) => {
  return corpora.map((corpus) => {
    if (corpus.syntax) {
      return { ...corpus, syntax: JSON.parse(JSON.stringify(corpus.syntax)) };
    }
    return corpus;
  });
};

export default copySyntaxData;
