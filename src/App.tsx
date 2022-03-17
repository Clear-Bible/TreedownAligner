import React, { useState } from 'react';

import './App.css';

import EditorWrapper from 'features/editor';
import cssVar from 'styles/cssVar';

import 'styles/theme.css';

import { CorpusRole } from 'structs';

function App() {
  const sblText =
    'οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται,';
  const lebText =
    'And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,';
  const nviText =
    'Y no solo en esto, sino también en nuestros sufrimientos, porque sabemos que el sufrimiento produce perseverancia;';
  const backTransText =
    'And not only in this, otherwise too in our sufferings, because we know that the suffering produces perseverance;';

  const sblWords = sblText.split(' ').map((word: string, index: number) => {
    const position = String(index + 1).padStart(3, '0');

    return {
      id: `45005003${position}0010`,
      corpusId: 'sbl',
      role: CorpusRole.Source,
      position: index,
      text: word,
    };
  });
  const lebWords = lebText.split(' ').map((word: string, index: number) => {
    return {
      id: `leb_${index}`,
      corpusId: 'leb',
      role: CorpusRole.Target,
      position: index,
      text: word,
    };
  });
  const nviWords = nviText.split(' ').map((word: string, index: number) => {
    return {
      id: `nvi_${index}`,
      corpusId: 'nvi',
      role: CorpusRole.Target,
      position: index,
      text: word,
    };
  });
  const backTransWords = backTransText
    .split(' ')
    .map((word: string, index: number) => {
      return {
        id: `backTrans_${index}`,
        corpusId: 'backTrans',
        role: CorpusRole.Target,
        position: index,
        text: word,
      };
    });

  const [theme, setTheme] = useState('night');
  const themeVar = theme as 'night' | 'day';

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
          justifyContent: 'center',
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
        />
      </div>
    </div>
  );
}

export default App;
