import { ReactElement, Fragment, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch } from 'app/hooks';
import { loadCorpora } from 'state/polyglot.slice';
import { loadAlignments } from 'state/alignment.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Alignment, Corpus } from 'structs';

interface EditorProps {
  corpora: Corpus[];
  alignments: Alignment[];
}

export const Editor = (props: EditorProps): ReactElement => {
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCorpora(props.corpora));
    dispatch(loadAlignments(props.alignments));
  }, [dispatch, props.corpora, props.alignments]);

  return (
    <Fragment>
      <Polyglot />
      <ControlPanel />
      <ContextPanel />
    </Fragment>
  );
};

export default Editor;
