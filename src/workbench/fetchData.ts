import xmlToJson from 'workbench/xmlToJson';
import cachedSyntaxData from 'workbench/cachedSyntaxData';
import { SyntaxRoot, Word, SyntaxType } from 'structs';

const MACULA_ENV = 'http://labs.clear.bible/symphony-dev';
const MACULA_ENV_TEMP =
  'https://v2022-05-24-002---symphony-api-dev-25c5xl4maa-uk.a.run.app/symphony-dev';

const parseWords = async (xmlDoc: string): Promise<Word[]> => {
  const parser = new DOMParser();

  const document = parser.parseFromString(xmlDoc, 'text/xml');
  const elements = Array.from(document.getElementsByTagName('w'));

  const sortedElements = elements.sort((a, b): number => {
    const aN = a.attributes.getNamedItem('n')?.value ?? '';
    const bN = b.attributes.getNamedItem('n')?.value ?? '';

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
      id: w.attributes.getNamedItem('n')?.value ?? '',
      corpusId: 'oshb',
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
        'n',
        'gloss',
        'strong',
        'osisId',
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

const fetchData = async (
  bookDoc: any,
  chapterNum: number,
  verseNum: number
): Promise<[SyntaxRoot, Word[]]> => {
  if (bookDoc) {
    const osisRef = `${bookDoc.OSIS}.${chapterNum}.${verseNum}`;

    if (Object.keys(cachedSyntaxData).includes(osisRef)) {
      const cachedSyntaxDatum = cachedSyntaxData[osisRef];
      const syntaxData = await parseSyntaxData(cachedSyntaxDatum);
      const words = await parseWords(cachedSyntaxDatum);

      if (syntaxData && words) {
        return [syntaxData, words];
      }
    }

    let response = null;

    // OT
    if (bookDoc.BookNumber >= 1 && bookDoc.BookNumber <= 39) {
      try {
        response = await fetch(
          `${MACULA_ENV_TEMP}/api/HOT/macula-hebrew/lowfat?osis-ref=${osisRef}`
        );
        console.log('RESP', response);
      } catch (err) {
        console.error(err);
      }
    }

    // NT
    if (bookDoc.BookNumber > 39 && bookDoc.BookNumber <= 66) {
      console.log('RESP', response);
      response = await fetch(
        `${MACULA_ENV}/api/GNT/Nestle1904/lowfat?osis-ref=${osisRef}`
      );
    }

    if (response === null || response === undefined) {
      alert(`Unable to fetch syntax data: ${osisRef}`);
      throw new Error(`There was a problem fetching syntax data: ${osisRef}`);
    }

    const xmlDoc = await response.text();
    const syntaxData = await parseSyntaxData(xmlDoc);
    const words = await parseWords(xmlDoc);

    if (syntaxData && words) {
      return [syntaxData, words];
    }
  }

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