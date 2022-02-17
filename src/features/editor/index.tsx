import { ReactElement, Fragment, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch } from 'app/hooks';
import { loadAlignments, loadTexts } from 'state/polyglot.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Alignment, Text } from 'structs';

interface EditorProps {
  texts: Text[];
  alignments: Alignment[];
}

export const Editor = (props: EditorProps): ReactElement => {
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTexts(props.texts));
    dispatch(loadAlignments(props.alignments));
  }, [dispatch, props.texts]);

  return (
    <Fragment>
      <Polyglot />
      <ControlPanel />
      <ContextPanel />
    </Fragment>
  );
};

export default Editor;
