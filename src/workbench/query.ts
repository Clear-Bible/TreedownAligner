import { Word, Corpus, CorpusRole } from 'structs';

export const querySyntax = (
  bookNum: number,
  chapterNum: number,
  verseNum: number
) => {
  console.log('QUERY', bookNum, chapterNum, verseNum);
  //console.log(matthew);
  //console.log(mark);
  //console.log(luke);
  //console.log(john);
  //console.log(acts);
  //console.log(romans);
  //console.log('axios get');
  //axios.get(matthew).then((response: any) => {
  //console.log('Your xml file as string', response.data);
  //});
};

const sblText =
  'οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται,';
const lebText =
  'And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,';
const nviText =
  'Y no solo en esto, sino también en nuestros sufrimientos, porque sabemos que el sufrimiento produce perseverancia;';
const backTransText =
  'And not only in this, otherwise too in our sufferings, because we know that the suffering produces perseverance;';

const availableCorpora: Corpus[] = [
  {
    id: 'sbl',
    name: 'SBL GNT',
    fullName: 'SBL Greek New Testament',
    language: 'grc',
    role: CorpusRole.Source,
    words: [],
    syntax: null,
  },

  {
    id: 'leb',
    name: 'LEB',
    fullName: 'Lexham English Bible',
    language: 'eng',
    role: CorpusRole.Target,
    words: [],
  },
  {
    id: 'nvi',
    name: 'NVI',
    fullName: 'Nueva Versión Internacional',
    language: 'spa',
    role: CorpusRole.Target,
    words: [],
  },
{
    id: 'backTrans',
    name: 'BT 1',
    fullName: 'Back Translation 1',
    language: 'eng',
    role: CorpusRole.Target,
    words: [],
  }

  ,
];

export const queryText = (
  corpusId: string,
  book: number,
  chapter: number,
  verse: number
): Corpus => {
  let text = '';

  if (corpusId === 'sbl') {
    text = sblText;
  }

  if (corpusId === 'leb') {
    text = lebText;
  }

  if (corpusId === 'nvi') {
    text = nviText;
  }

  if (corpusId === 'backTrans') {
    text = backTransText;
  }

  const corpus = availableCorpora.find((corpus) => {
    return corpus.id === corpusId;
  });

  if (!corpus) {
    throw new Error(`Unable to find requested corpus: ${corpusId}`);
  }

  const words = text.split(' ').map((word: string, index: number) => {
    let id = '';
    
    if (corpus.role === CorpusRole.Source) {
      const bookString = String(book).padStart(2, '0');
      const chapterString = String(chapter).padStart(3, '0');
      const verseString = String(verse).padStart(3, '0');
      const positionString = String(index + 1).padStart(3, '0');
      id = `${bookString}${chapterString}${verseString}${positionString}0010`;
    } else {
      id = `${corpusId}_${index}`
    }

    return {
      id,
      corpusId: corpusId,
      role: CorpusRole.Source,
      position: index,
      text: word,
    };
  });

  return {
    id: corpus?.id ?? '',
    name: corpus?.name ?? '',
    fullName: corpus?.fullName ?? '',
    language: corpus?.language ?? '',
    role: corpus?.role ?? CorpusRole.Source,
    words: words,
  };
};
