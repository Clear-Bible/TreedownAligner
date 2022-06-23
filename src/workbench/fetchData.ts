import xmlToJson from 'workbench/xmlToJson';
import cachedSyntaxData from 'workbench/cachedSyntaxData';
import { SyntaxRoot, Word, SyntaxType } from 'structs';

const MACULA_ENV = 'http://labs.clear.bible/symphony-dev';
const MACULA_ENV_TEMP =
  'https://v2022-05-24-002---symphony-api-dev-25c5xl4maa-uk.a.run.app/symphony-dev';
const MACULA_PR_ENV =
  'https://pr-63---symphony-api-dev-25c5xl4maa-uk.a.run.app/symphony-dev';

const determineCorpusId = (isOT: boolean, isNT: boolean) => {
  if (isOT) {
    return 'oshb';
  }

  if (isNT) {
    return 'nestle1904';
  }
};

const parseWords = async (
  xmlDoc: string,
  isOT: boolean,
  isNT: boolean
): Promise<Word[]> => {
  const corpusId = determineCorpusId(isOT, isNT);
  const parser = new DOMParser();

  const document = parser.parseFromString(xmlDoc, 'text/xml');
  const elements = Array.from(document.getElementsByTagName('w'));

  const sortedElements = elements.sort((a, b): number => {
    const aN = a.attributes.getNamedItem('id')?.value ?? '';
    const bN = b.attributes.getNamedItem('id')?.value ?? '';

    if (!aN || !bN) {
      return 0;
    }

    if (aN < bN) {
      return -1;
    }

    if (bN < aN) {
      return 1;
    }

    return 0;
  });

  const words = sortedElements.map((w, index): Word => {
    const word: Word = {
      id: w.attributes.getNamedItem('id')?.value ?? '',
      corpusId: corpusId ?? '',
      text: w.innerHTML,
      position: index,
    };

    if (w.attributes.getNamedItem('after')) {
      word.after = w.attributes.getNamedItem('after')?.value;
    }

    return word;
  });

  return words;
};

const parseSyntaxData = async (xmlDoc: string): Promise<SyntaxRoot | null> => {
  try {
    const jsonizedXml = await xmlToJson(
      xmlDoc,
      [
        'rule',
        'class',
        'role',
        'head',
        'discontinuous',
        'lemma',
        'person',
        'number',
        'gender',
        'case',
        'tense',
        'voice',
        'mood',
        'articular',
        'det',
        'type',
        'id',
        'n',
        'gloss',
        'strong',
        'osisId',
        'after',
      ],
      'sentences'
    );
    return jsonizedXml as SyntaxRoot;
  } catch (error) {
    console.error('There was an error jsonizing syntax data.');
    console.error(xmlDoc);
    console.error(error);
    return null;
  }
};

const titleCase = (input: string): string => {
  return input
    .split('')
    .map((letter, index) => {
      if (index === 0) {
        return letter.toUpperCase();
      }
      return letter.toLowerCase();
    })
    .join('');
};

const fetchData = async (
  bookDoc: any,
  chapterNum: number,
  verseNum: number
): Promise<[SyntaxRoot, Word[]]> => {
  if (bookDoc) {
    const isOT = bookDoc.BookNumber >= 1 && bookDoc.BookNumber <= 39;
    const isNT = bookDoc.BookNumber > 39 && bookDoc.BookNumber <= 66;
    const osisRef = `${titleCase(bookDoc.OSIS)}.${chapterNum}.${verseNum}`;

    console.log('QUERY SOURCE OSIS', osisRef);

    if (Object.keys(cachedSyntaxData).includes(osisRef)) {
      const cachedSyntaxDatum = cachedSyntaxData[osisRef];
      const syntaxData = await parseSyntaxData(cachedSyntaxDatum);
      const words = await parseWords(cachedSyntaxDatum, isOT, isNT);

      if (syntaxData && words) {
        return [syntaxData, words];
      }
    }

    let response = null;

    // OT
    if (isOT) {
      const usfmRef = `${bookDoc.ParaText.toUpperCase()}%20${chapterNum}:${verseNum}`;
      try {
        response = await fetch(
          `${MACULA_PR_ENV}/api/HOT/macula-hebrew/lowfat?usfm-ref=${usfmRef}`
        );
        console.log('RESP', response);
      } catch (err) {
        console.error(err);
      }
    }

    // NT
    if (isNT) {
      const usfmRef = `${bookDoc.ParaText.toUpperCase()}%20${chapterNum}:${verseNum}`;
      // const osisRef = `${titleCase(bookDoc.ParaText)}.${chapterNum}.${verseNum}`;
      console.log('RESP', response);
      response = await fetch(
        `${MACULA_PR_ENV}/api/GNT/Nestle1904/lowfat?usfm-ref=${usfmRef}`
      );
    }

    if (response === null || response === undefined) {
      alert(`Unable to fetch syntax data: ${osisRef}`);
      throw new Error(`There was a problem fetching syntax data: ${osisRef}`);
    }

    const xmlDoc = await response.text();
    const syntaxData = await parseSyntaxData(xmlDoc);
    const words = await parseWords(xmlDoc, isOT, isNT);

    if (syntaxData && words) {
      return [syntaxData, words];
    }
  }

  // This shouldn't actually happen.
  return [
    {
      _syntaxType: SyntaxType.Source,
      content: { elementType: 'wat?' },
      children: [],
    },
    [],
  ];
};

export default fetchData;
