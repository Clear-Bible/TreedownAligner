import { ReactElement, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch } from 'app/hooks';
import { setTheme } from 'state/app.slice';
import { loadAlignments, loadCorpora } from 'state/alignment.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Alignment, Corpus } from 'structs';

import syntaxMapper from 'features/treedown/syntaxMapper';

import cssVar from 'styles/cssVar';
import 'styles/theme.css';

interface EditorProps {
  corpora: Corpus[];
  alignments: Alignment[];
  theme: 'night' | 'day';
}

export const Editor = (props: EditorProps): ReactElement => {
  const { corpora, alignments, theme } = props;
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  useEffect(() => {
    const syntax = corpora[0].syntax;

    if (syntax && Object.keys(syntax).length) {
      console.log('mapper time');
      const mappedCorporaSyntax = syntaxMapper(syntax, alignments[1]);
      corpora[1].syntax = mappedCorporaSyntax;
    }

    dispatch(loadCorpora(corpora));
    dispatch(loadAlignments(alignments));
  }, [dispatch, corpora, alignments]);

  return (
    <div
      style={{
        backgroundColor: cssVar('background', theme),
        width: '1200px',
      }}
    >
      <Polyglot />
      <ControlPanel />
      <ContextPanel />
    </div>
  );
};

export default Editor;
