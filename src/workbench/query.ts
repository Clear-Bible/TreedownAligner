import { Corpus } from 'structs';

const sblText =
  'οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται,';
const lebText =
  'And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,';
const nviText =
  'Y no solo en esto, sino también en nuestros sufrimientos, porque sabemos que el sufrimiento produce perseverancia;';
const backTransText =
  'And not only in this, otherwise too in our sufferings, because we know that the suffering produces perseverance;';

const oshbText =
  'בְּ רֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַ שָּׁמַ֖יִם וְ אֵ֥ת הָ אָֽרֶץ';

const availableCorpora: Corpus[] = [
  {
    id: 'sbl',
    name: 'SBL GNT',
    fullName: 'SBL Greek New Testament',
    language: 'grc',
    words: [],
    syntax: undefined,
  },

  {
    id: 'oshb',
    name: 'OSHB HOT',
    fullName: 'Open Scriptures Hebrew Bible',
    language: 'hbo',
    words: [],
    syntax: undefined,
  },

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

export const queryText = (
  corpusId: string,
  book: number,
  chapter: number,
  verse: number
): Corpus => {
  let text = '';

  if (corpusId === 'oshb') {
    text = oshbText;
  }

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
    let language = '';

    if (corpus.id === 'sbl') {
      const bookString = String(book).padStart(2, '0');
      const chapterString = String(chapter).padStart(3, '0');
      const verseString = String(verse).padStart(3, '0');
      const positionString = String(index + 1).padStart(3, '0');
      id = `${bookString}${chapterString}${verseString}${positionString}0010`;
      language = 'grc';
    } else if (corpus.id === 'oshb') {
      const bookString = String(book).padStart(2, '0');
      const chapterString = String(chapter).padStart(3, '0');
      const verseString = String(verse).padStart(3, '0');
      const positionString = String(index + 1).padStart(3, '0');
      const wordPartString = '1';
      id = `${bookString}${chapterString}${verseString}${positionString}${wordPartString}`;
      language = 'hbo';
    } else {
      id = `${corpusId}_${index}`;
    }

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
