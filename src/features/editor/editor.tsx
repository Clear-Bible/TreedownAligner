import { ReactElement, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch } from 'app/hooks';
import { setTheme } from 'state/app.slice';
import { loadAlignments, loadCorpora } from 'state/alignment.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Alignment, Corpus } from 'structs';
import copySyntaxData from 'helpers/copySyntaxData';

import cssVar from 'styles/cssVar';
import '../../styles/theme.css';

interface EditorProps {
  corpora: Corpus[];
  alignments: Alignment[];
  theme: 'night' | 'day';
  alignmentUpdated: Function;
}

export const Editor = (props: EditorProps): ReactElement => {
  const { corpora, alignments, theme, alignmentUpdated } = props;
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(theme));
  }, [dispatch, theme]);

  useEffect(() => {
    if (alignments) {
      dispatch(loadAlignments(alignments));
    }

    if (corpora) {
      dispatch(loadCorpora(copySyntaxData(corpora)));
    }
  }, [dispatch, corpora, alignments]);

  return (
    <div
      className="editor-container"
      style={{
        backgroundColor: cssVar('background', theme),
        width: '1200px',
      }}
    >
      <Polyglot />
      <ControlPanel alignmentUpdated={alignmentUpdated} />
      <ContextPanel />
    </div>
  );
};

export default Editor;
