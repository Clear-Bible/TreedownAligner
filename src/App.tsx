import React from 'react';

import './App.css';

import Editor from 'features/editor';

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
    return { id: `sbl_${index}`, position: index, text: word };
  });
  const lebWords = lebText.split(' ').map((word: string, index: number) => {
    return { id: `leb_${index}`, position: index, text: word };
  });
  const nviWords = nviText.split(' ').map((word: string, index: number) => {
    return { id: `nvi_${index}`, position: index, text: word };
  });
  const backTransWords = backTransText
    .split(' ')
    .map((word: string, index: number) => {
      return { id: `backTrans_${index}`, position: index, text: word };
    });

  return (
    <div style={{ position: 'relative' }}>
      <Editor
        texts={[
          {
            id: 'sbl',
            name: 'SBL GNT',
            text: sblText,
            words: sblWords,
          },
          {
            id: 'leb',
            name: 'LEB',
            text: lebText,
            words: lebWords,
          },
          {
            id: 'nvi',
            name: 'NVI',
            text: nviText,
            words: nviWords,
          },
          {
            id: 'backTrans',
            name: 'Back Trans',
            text: backTransText,
            words: backTransWords,
          },
        ]}
      />
    </div>
  );
}

export default App;
