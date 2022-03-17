import { ReactElement, useState } from 'react';

import EditorWrapper from 'features/editor';

import cssVar from 'styles/cssVar';
import 'styles/theme.css';

import { querySyntax } from 'workbench/query';
import books from 'workbench/books';

interface WorkbenchProps {}

const Workbench = (props: WorkbenchProps): ReactElement => {
  const [theme, setTheme] = useState('night');
  const themeVar = theme as 'night' | 'day';

  const [showSourceText, setShowSourceText] = useState(true);
  const [showTargetText, setShowTargetText] = useState(true);
  const [showLwcText, setShowLwcText] = useState(true);
  const [showBackText, setShowBackText] = useState(true);

  const [book, setBook] = useState(45);
  const [chapter, setChapter] = useState(5);
  const [verse, setVerse] = useState(3);

  const bookDoc = books.find((bookItem) => bookItem.BookNumber === book);

  let chapterCount = 0;

  if (bookDoc && bookDoc?.ChapterCount) {
    chapterCount = Number(bookDoc.ChapterCount);
  }
  const chapters = Array.from(Array(chapterCount).keys()).map((x) => x + 1);

  const verses = Array.from(Array(200).keys()).map((x) => x + 1);

  querySyntax(book, chapter, verse);

  if (theme === 'night') {
    document.body.style.backgroundColor = 'var(--night-background)';
  }

  if (theme === 'day') {
    document.body.style.backgroundColor = 'var(--day-background)';
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
        {/* {' '}
        <EditorWrapper
          theme={theme as 'night' | 'day'}
          corpora={[
            {
              id: 'sbl',
              name: 'SBL GNT',
              fullName: 'SBL Greek New Testament',
              language: 'grc',
              role: CorpusRole.Source,
              words: sblWords,
            },
            {
              id: 'leb',
              name: 'LEB',
              fullName: 'Lexham English Bible',
              language: 'eng',
              role: CorpusRole.Target,
              words: lebWords,
            },
            {
              id: 'nvi',
              name: 'NVI',
              fullName: 'Nueva Versión Internacional',
              language: 'spa',
              role: CorpusRole.Target,
              words: nviWords,
            },
          ]}
          alignments={[
            {
              source: 'sbl',
              target: 'leb',
              links: [
                { sources: ['450050030010010'], targets: ['leb_1'] },
                { sources: ['450050030020010'], targets: ['leb_2'] },
                { sources: ['450050030030010'], targets: ['leb_0'] },
                { sources: ['450050030040010'], targets: ['leb_4'] },
                { sources: ['450050030050010'], targets: ['leb_6'] },
                { sources: ['450050030060010'], targets: ['leb_5', 'leb_7'] },
                { sources: ['450050030070010'], targets: ['leb_8'] },
                {
                  sources: ['450050030080010', '450050030090010'],
                  targets: ['leb_9', 'leb_10'],
                },
                { sources: ['450050030100010'], targets: ['leb_12', 'leb_13'] },
                { sources: ['450050030110010'], targets: ['leb_11'] },
                { sources: ['450050030130010'], targets: ['leb_15'] },
                { sources: ['450050030140010'], targets: ['leb_17', 'leb_18'] },
                { sources: ['450050030150010'], targets: ['leb_16'] },
              ],
            },
            {
              source: 'sbl',
              target: 'nvi',
              links: [
                { sources: ['450050030010010'], targets: ['nvi_1'] },
                { sources: ['450050030020010'], targets: ['nvi_2'] },
                { sources: ['450050030030010'], targets: ['nvi_0'] },
                { sources: ['450050030040010'], targets: ['nvi_5'] },
                { sources: ['450050030050010'], targets: ['nvi_6'] },
                { sources: ['450050030070010'], targets: ['nvi_7'] },
                {
                  sources: ['450050030080010', '450050030090010'],
                  targets: ['nvi_8', 'nvi_9'],
                },
                { sources: ['450050030100010'], targets: ['nvi_11'] },
                { sources: ['450050030110010'], targets: ['nvi_12'] },
                { sources: ['450050030120010'], targets: ['nvi_13'] },
                { sources: ['450050030130010'], targets: ['nvi_14'] },
                { sources: ['450050030140010'], targets: ['nvi_16'] },
                { sources: ['450050030150010'], targets: ['nvi_15'] },
              ],
            },
          ]}
        />{' '}
        */}
      </div>
    </div>
  );
};

export default Workbench;
