import { ReactElement, useState, useEffect } from 'react';

import { Corpus, SyntaxType, SyntaxRoot, Word } from 'structs';

// import cssVar from 'styles/cssVar';
// import '../styles/theme.css';

import EditorWrapper from 'features/editor';

// import fetchSyntaxData from 'workbench/fetchSyntaxData';
import fetchData from 'workbench/fetchData';

import { queryText, queryAlignment, hasAlignment } from 'workbench/query';
import books from 'workbench/books';

import placeholderTreedown from 'features/treedown/romans-example.treedown.json';
import { CircularProgress, Box } from '@mui/material';

interface WorkbenchProps { }

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
  // let book = 1;
  // let chapter = 1;
  // let verse = 1;

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

const WorkbenchHebrew = (props: WorkbenchProps): ReactElement => {
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

  const [words, setWords] = useState([] as Word[]);

  // const defaultTestament: null | 'ot' | 'nt' = null;
  const [testament, setTestament] = useState('');

  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        // const syntaxData = await fetchSyntaxData(bookDoc, chapter, verse);
        const [syntaxData, words] = await fetchData(bookDoc, chapter, verse);
        if (syntaxData && words && bookDoc) {
          setSyntaxData(syntaxData as SyntaxRoot);
          setWords(words);
          const testament = bookDoc?.BookNumber < 39 ? 'ot' : 'nt';
          setTestament(testament);

          document.title = `${documentTitle} ${bookDoc ? bookDoc.OSIS : book
            }.${chapter}.${verse}`;
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadSyntaxData().catch(console.error);
  }, [bookDoc, book, chapter, verse]);

  // if (theme === 'night') {
  //   document.body.style.backgroundColor = 'var(--night-background)';
  // }
  //
  // if (theme === 'day') {
  //   document.body.style.backgroundColor = 'var(--day-background)';
  // }

  const corpora: Corpus[] = [];

  if (bookDoc) {
    const osisRef = `${bookDoc?.OSIS}.${chapter}.${verse}`;
    const isOT = bookDoc?.BookNumber >= 1 && bookDoc?.BookNumber <= 39;
    const isNT = bookDoc?.BookNumber > 39 && bookDoc?.BookNumber <= 66;

    if (showSourceText) {
      if (testament === 'nt') {
        if (words && words.length > 0) {
          corpora.push({
            id: 'nestle1904',
            name: 'Nestle 1904 GNT',
            fullName: 'Nestle 1904 Greek New Testament',
            language: 'grc',
            syntax: syntaxData,
            words,
          });
        }
      }
      // const sourceCorpus = {
      //   ...queryText('oshb', book, chapter, verse),
      //   syntax: { ...syntaxData, _syntaxType: SyntaxType.Source },
      // };
      //
      // console.log(sourceCorpus);
      if (testament === 'ot') {
        if (words && words.length > 0) {
          corpora.push({
            id: 'oshb',
            name: 'OSHB',
            fullName: 'Open Scriptures Hebrew Bible',
            language: 'hbo',
            syntax: syntaxData,
            words,
          });
        }
      }
    }

    if (showTargetText) {
      corpora.push({
        ...queryText('nvi', osisRef),
        syntax: hasAlignment('nvi', osisRef)
          ? { ...syntaxData, _syntaxType: SyntaxType.Mapped }
          : undefined,
      });
    }

    if (showLwcText) {
      corpora.push({
        ...queryText('leb', osisRef),
        syntax: hasAlignment('leb', osisRef)
          ? { ...syntaxData, _syntaxType: SyntaxType.MappedSecondary }
          : undefined,
      });
    }
    if (showBackText) {
      corpora.push(queryText('backTrans', osisRef));
    }

    return (
      <div
        style={
          {
            // backgroundColor: cssVar('background', themeVar),
          }
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '2rem',
            border: '1px solid',
            // borderColor: cssVar('border-color', themeVar),
            textAlign: 'center',
            margin: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
            maxWidth: '800px',
            // backgroundColor: cssVar('background', themeVar),
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day')
                }
              }
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day'),
                }
              }
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day')
                }
              }
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

            <Box
              sx={{
                display: 'flex',
                width: '3.5rem',
                height: '3.5rem',
                padding: '0.5rem',
              }}
            >
              {loading && <CircularProgress size="1.5rem" />}
            </Box>
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day')
                }
              }
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day'),
                }
              }
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day')
                }
              }
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
              style={
                {
                  // color: cssVar('font-color', theme as 'night' | 'day')
                }
              }
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
            // borderColor: cssVar('border-color', themeVar),
            margin: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
            maxWidth: '1200px',
          }}
        >
          <EditorWrapper
            theme={theme as 'night' | 'day'}
            corpora={corpora}
            alignments={queryAlignment(osisRef, isOT, isNT)}
            alignmentUpdated={(alignments: any) => {
              setUpdatedAlignments(alignments);
            }}
          />
        </div>
        <div>{JSON.stringify(updatedAlignments, null, 2)}</div>
      </div>
    );
  }
  return <p> {'No book doc?'} </p>;
};

export default WorkbenchHebrew;
