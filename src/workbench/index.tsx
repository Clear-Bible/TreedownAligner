import { ReactElement, useState, useEffect } from 'react';

import { Corpus, SyntaxType, SyntaxRoot } from 'structs';

import cssVar from 'styles/cssVar';
import '../styles/theme.css';

import EditorWrapper from 'features/editor';

import fetchSyntaxData from 'workbench/fetchSyntaxData';

import { queryText } from 'workbench/query';
import books from 'workbench/books';

import placeholderTreedown from 'features/treedown/treedown.json';

interface WorkbenchProps {}

const documentTitle = '🌲⬇️';

const getBookNumber = (bookName: string) => {
  const bookDoc = books.find(
    (bookItem) => bookItem.OSIS.toLowerCase() === bookName.toLowerCase()
  );
  if (bookDoc) {
    return bookDoc.BookNumber;
  }
};
const getRefParam = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
};

const getDefaultRef = (): number[] => {
  let book = 45;
  let chapter = 5;
  let verse = 3;

  const refParam = getRefParam();

  if (refParam) {
    const parsedRegex = /^(\w+)(\.)(\w+)(\.)(\w+)$/.exec(refParam);

    if (parsedRegex) {
      const parsedBook = getBookNumber(parsedRegex[1]);

      if (parsedBook) {
        book = parsedBook;
      }
      const parsedChapter = Number(parsedRegex[3] ?? undefined);

      if (parsedChapter && Number.isFinite(parsedChapter)) {
        chapter = parsedChapter;
      }

      const parsedVerse = Number(parsedRegex[5]);
      if (parsedVerse && Number.isFinite(parsedVerse)) {
        verse = parsedVerse;
      }
    }
  }

  return [book, chapter, verse];
};

const Workbench = (props: WorkbenchProps): ReactElement => {
  const [defaultBook, defaultChapter, defaultVerse] = getDefaultRef();

  const [updatedAlignments, setUpdatedAlignments] = useState(null);

  document.title = getRefParam()
    ? `${documentTitle} ${getRefParam()}`
    : documentTitle;

  const [theme, setTheme] = useState('night');

  const themeVar = theme as 'night' | 'day';

  const [showSourceText, setShowSourceText] = useState(true);
  const [showTargetText, setShowTargetText] = useState(true);
  const [showLwcText, setShowLwcText] = useState(true);
  const [showBackText, setShowBackText] = useState(true);

  const [book, setBook] = useState(defaultBook);
  const [chapter, setChapter] = useState(defaultChapter);
  const [verse, setVerse] = useState(defaultVerse);

  const [syntaxData, setSyntaxData] = useState(
    placeholderTreedown as SyntaxRoot
  );

  const bookDoc = books.find((bookItem) => bookItem.BookNumber === book);

  let chapterCount = 0;

  if (bookDoc && bookDoc?.ChapterCount) {
    chapterCount = Number(bookDoc.ChapterCount);
  }
  const chapters = Array.from(Array(chapterCount).keys()).map((x) => x + 1);

  const verses = Array.from(Array(200).keys()).map((x) => x + 1);

  useEffect(() => {
    const loadSyntaxData = async () => {
      try {
        const syntaxData = await fetchSyntaxData(bookDoc, chapter, verse);
        if (syntaxData) {
          setSyntaxData(syntaxData as SyntaxRoot);
          document.title = `${documentTitle} ${
            bookDoc ? bookDoc.OSIS : book
          }.${chapter}.${verse}`;
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadSyntaxData().catch(console.error);
  }, [bookDoc, book, chapter, verse]);

  if (theme === 'night') {
    document.body.style.backgroundColor = 'var(--night-background)';
  }

  if (theme === 'day') {
    document.body.style.backgroundColor = 'var(--day-background)';
  }

  const corpora: Corpus[] = [];

  if (showSourceText) {
    const sourceCorpus = {
      ...queryText('sbl', book, chapter, verse),
      syntax: { ...syntaxData, _syntaxType: SyntaxType.Source },
    };

    corpora.push(sourceCorpus);
  }

  if (showTargetText) {
    corpora.push({
      ...queryText('nvi', book, chapter, verse),
      syntax: { ...syntaxData, _syntaxType: SyntaxType.Mapped },
    });
  }

  if (showLwcText) {
    corpora.push({
      ...queryText('leb', book, chapter, verse),
      syntax: { ...syntaxData, _syntaxType: SyntaxType.MappedSecondary },
    });
  }

  if (showBackText) {
    corpora.push(queryText('backTrans', book, chapter, verse));
  }

  return (
    <div
      style={{
        backgroundColor: cssVar('background', themeVar),
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '2rem',
          border: '1px solid',
          borderColor: cssVar('border-color', themeVar),
          textAlign: 'center',
          margin: 'auto',
          marginTop: '1rem',
          marginBottom: '1rem',
          maxWidth: '800px',
          backgroundColor: cssVar('background', themeVar),
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            Book{' '}
            <select
              value={book}
              onChange={(e) => {
                setBook(Number(e.target.value));
              }}
            >
              {books.map((book: any) => {
                return (
                  <option
                    key={`book_option_${book.BookNumber}`}
                    value={`${book.BookNumber}`}
                  >
                    {book.EnglishBookName}
                  </option>
                );
              })}
              ;
            </select>
          </label>
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            Chapter{' '}
            <select
              value={chapter}
              onChange={(e) => {
                setChapter(Number(e.target.value));
              }}
            >
              {chapters.map((chapter) => {
                return (
                  <option key={`chapter_option_${chapter}`} value={chapter}>
                    {chapter}
                  </option>
                );
              })}
            </select>
          </label>
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            Verse{' '}
            <select
              value={verse}
              onChange={(e) => {
                setVerse(Number(e.target.value));
              }}
            >
              {verses.map((verse) => {
                return (
                  <option key={`verse_option_${verse}`} value={verse}>
                    {verse}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <button
          onClick={() => {
            if (theme === 'night') {
              setTheme('day');
            }

            if (theme === 'day') {
              setTheme('night');
            }
          }}
        >
          Toggle Theme
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            <input
              type="checkbox"
              name="source"
              checked={showSourceText}
              onChange={() => {
                setShowSourceText(!showSourceText);
              }}
            />
            Source
          </label>
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            <input
              type="checkbox"
              name="source"
              checked={showTargetText}
              onChange={() => {
                setShowTargetText(!showTargetText);
              }}
            />
            Target
          </label>

          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            <input
              type="checkbox"
              name="source"
              checked={showLwcText}
              onChange={() => {
                setShowLwcText(!showLwcText);
              }}
            />
            LWC
          </label>
          <label
            style={{ color: cssVar('font-color', theme as 'night' | 'day') }}
          >
            <input
              type="checkbox"
              name="source"
              checked={showBackText}
              onChange={() => {
                setShowBackText(!showBackText);
              }}
            />
            Back
          </label>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem',
          border: '1px solid',
          borderColor: cssVar('border-color', themeVar),
          margin: 'auto',
          marginTop: '1rem',
          marginBottom: '1rem',
          maxWidth: '1200px',
        }}
      >
        <EditorWrapper
          theme={theme as 'night' | 'day'}
          corpora={corpora}
          alignments={[
            {
              source: 'nvi',
              target: 'leb',
              links: [
                { sources: ['nvi_0'], targets: ['leb_0'] },
                { sources: ['nvi_1'], targets: ['leb_1'] },
                { sources: ['nvi_2'], targets: ['leb_2'] },
                { sources: ['nvi_4'], targets: ['leb_3'] },
                { sources: ['nvi_5'], targets: ['leb_4'] },
                { sources: ['nvi_6'], targets: ['leb_6'] },
                { sources: ['nvi_7'], targets: ['leb_8'] },
                { sources: ['nvi_8', 'nvi_9'], targets: ['leb_9', 'leb_10'] },
                { sources: ['nvi_10'], targets: ['leb_11'] },
                { sources: ['nvi_11'], targets: ['leb_12', 'leb_13'] },
                { sources: ['nvi_12'], targets: ['leb_14'] },
                { sources: ['nvi_14'], targets: ['leb_15'] },
                { sources: ['nvi_15'], targets: ['leb_16'] },
                { sources: ['nvi_16'], targets: ['leb_17', 'leb_18'] },
              ],
            },
            {
              source: 'nvi',
              target: 'sbl',
              links: [
                { sources: ['nvi_1'], targets: ['450050030010010'] },
                { sources: ['nvi_2'], targets: ['450050030020010'] },
                { sources: ['nvi_0'], targets: ['450050030030010'] },
                { sources: ['nvi_5'], targets: ['450050030040010'] },
                { sources: ['nvi_6'], targets: ['450050030050010'] },
                { sources: ['nvi_7'], targets: ['450050030070010'] },
                {
                  sources: ['nvi_8', 'nvi_9'],
                  targets: ['450050030080010', '450050030090010'],
                },
                { sources: ['nvi_11'], targets: ['450050030100010'] },
                { sources: ['nvi_12'], targets: ['450050030110010'] },
                { sources: ['nvi_13'], targets: ['450050030120010'] },
                { sources: ['nvi_14'], targets: ['450050030130010'] },
                { sources: ['nvi_16'], targets: ['450050030140010'] },
                { sources: ['nvi_15'], targets: ['450050030150010'] },
              ],
            },
          ]}
          alignmentUpdated={(alignments: any) => {
            setUpdatedAlignments(alignments);
          }}
        />
      </div>
      <div>{JSON.stringify(updatedAlignments, null, 2)}</div>
    </div>
  );
};

export default Workbench;
