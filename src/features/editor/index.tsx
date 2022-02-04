import { ReactElement, Fragment, useEffect } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { loadTexts } from 'features/polyglot/polyglot.slice';

import Polyglot from 'features/polyglot';
import ControlPanel from 'features/controlPanel';
import ContextPanel from 'features/contextPanel';

import { Text } from 'structs';

interface EditorProps {
  texts: Text[];
}

export const Editor = (props: EditorProps): ReactElement => {
  useDebug('Editor');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTexts(props.texts));
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
