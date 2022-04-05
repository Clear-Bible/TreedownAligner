import { Corpus, SyntaxType } from 'structs';

const copySyntaxData = (corpora: Corpus[]): Corpus[] => {
  const corpusWithSyntax = corpora.find((corpus: Corpus): boolean => {
    return Boolean(corpus.syntax);
  });

  return corpora.map((corpus: Corpus): Corpus => {
    if (corpusWithSyntax && corpus.id !== corpusWithSyntax.id) {
      const copiedSyntax = JSON.parse(JSON.stringify(corpusWithSyntax.syntax));
      return {
        ...corpus,
        syntax: { ...copiedSyntax, _syntaxType: SyntaxType.Mapped },
      };
    }
    return corpus;
  });
};

export default copySyntaxData;
