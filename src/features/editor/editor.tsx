import { ReactElement, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch } from 'app/hooks';
import { setTheme } from 'state/app.slice';
import { loadCorpora } from 'state/polyglot.slice';
import { loadAlignments } from 'state/alignment.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Alignment, Corpus } from 'structs';

import cssVar from 'styles/cssVar';
import 'styles/theme.css';

interface EditorProps {
  corpora: Corpus[];
  alignments: Alignment[];
  theme: 'night' | 'day';
}

export const Editor = (props: EditorProps): ReactElement => {
  const { theme } = props;
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  useEffect(() => {
    dispatch(loadCorpora(props.corpora));
    dispatch(loadAlignments(props.alignments));
  }, [dispatch, props.corpora, props.alignments]);

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
