//import React, { useState } from 'react';

import './App.css';

import Workbench from 'workbench';
//import cssVar from 'styles/cssVar';

import 'styles/theme.css';

//import { CorpusRole } from 'structs';

function App() {
  //const sblText =
  //'οὐ μόνον δέ, ἀλλὰ καὶ καυχώμεθα ἐν ταῖς θλίψεσιν, εἰδότες ὅτι ἡ θλῖψις ὑπομονὴν κατεργάζεται,';
  //const lebText =
  //'And not only this, but we also boast in our afflictions, because we know that affliction produces patient endurance,';
  //const nviText =
  //'Y no solo en esto, sino también en nuestros sufrimientos, porque sabemos que el sufrimiento produce perseverancia;';
  //const backTransText =
  //'And not only in this, otherwise too in our sufferings, because we know that the suffering produces perseverance;';

  //const sblWords = sblText.split(' ').map((word: string, index: number) => {
  //const position = String(index + 1).padStart(3, '0');

  //return {
  //id: `45005003${position}0010`,
  //corpusId: 'sbl',
  //role: CorpusRole.Source,
  //position: index,
  //text: word,
  //};
  //});
  //const lebWords = lebText.split(' ').map((word: string, index: number) => {
  //return {
  //id: `leb_${index}`,
  //corpusId: 'leb',
  //role: CorpusRole.Target,
  //position: index,
  //text: word,
  //};
  //});
  //const nviWords = nviText.split(' ').map((word: string, index: number) => {
  //return {
  //id: `nvi_${index}`,
  //corpusId: 'nvi',
  //role: CorpusRole.Target,
  //position: index,
  //text: word,
  //};
  //});
  //const backTransWords = backTransText
  //.split(' ')
  //.map((word: string, index: number) => {
  //return {
  //id: `backTrans_${index}`,
  //corpusId: 'backTrans',
  //role: CorpusRole.Target,
  //position: index,
  //text: word,
  //};
  //});

  return <Workbench />;
}

export default App;
