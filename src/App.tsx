import React from 'react';

import './App.css';

import EditorWrapper from 'features/editor';

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
    return {
      id: `sbl_${index}`,
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

  return (
    <div style={{ position: 'relative' }}>
      <EditorWrapper
        corpora={[
          {
            id: 'sbl',
            name: 'SBL GNT',
            language: 'grc',
            role: CorpusRole.Source,
            words: sblWords,
          },
          {
            id: 'leb',
            name: 'LEB',
            language: 'eng',
            role: CorpusRole.Target,
            words: lebWords,
          },
          {
            id: 'nvi',
            name: 'NVI',
            language: 'spa',
            role: CorpusRole.Target,
            words: nviWords,
          },
          {
            id: 'backTrans',
            name: 'Back Trans',
            language: 'eng',
            role: CorpusRole.Target,
            words: backTransWords,
          },
        ]}
        alignments={[
          {
            source: 'sbl',
            target: 'leb',
            links: [
              { sources: ['sbl_0'], targets: ['leb_1'] },
              { sources: ['sbl_1'], targets: ['leb_2'] },
              { sources: ['sbl_2'], targets: ['leb_0'] },
              { sources: ['sbl_3'], targets: ['leb_4'] },
              { sources: ['sbl_4'], targets: ['leb_6'] },
              { sources: ['sbl_5'], targets: ['leb_5', 'leb_7'] },
              { sources: ['sbl_6'], targets: ['leb_8'] },
              { sources: ['sbl_7', 'sbl_8'], targets: ['leb_9', 'leb_10'] },
              { sources: ['sbl_9'], targets: ['leb_12', 'leb_13'] },
              { sources: ['sbl_10'], targets: ['leb_11'] },
              { sources: ['sbl_12'], targets: ['leb_15'] },
              { sources: ['sbl_13'], targets: ['leb_17', 'leb_18'] },
              { sources: ['sbl_14'], targets: ['leb_16'] },
            ],
          },
          {
            source: 'sbl',
            target: 'nvi',
            links: [
              { sources: ['sbl_0'], targets: ['nvi_1'] },
              { sources: ['sbl_1'], targets: ['nvi_2'] },
              { sources: ['sbl_2'], targets: ['nvi_0'] },
              { sources: ['sbl_3'], targets: ['nvi_5'] },
              { sources: ['sbl_4'], targets: ['nvi_6'] },
              { sources: ['sbl_6'], targets: ['nvi_7'] },
              { sources: ['sbl_7', 'sbl_8'], targets: ['nvi_8', 'nvi_9'] },
              { sources: ['sbl_9'], targets: ['nvi_11'] },
              { sources: ['sbl_10'], targets: ['nvi_12'] },
              { sources: ['sbl_11'], targets: ['nvi_13'] },
              { sources: ['sbl_12'], targets: ['nvi_14'] },
              { sources: ['sbl_13'], targets: ['nvi_16'] },
              { sources: ['sbl_14'], targets: ['nvi_15'] },
            ],
          },
        ]}
      />
    </div>
  );
}

export default App;
