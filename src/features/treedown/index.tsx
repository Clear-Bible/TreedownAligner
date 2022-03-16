import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import cssVar from 'styles/cssVar';

import { Corpus } from 'structs';

interface TreedownProps {
  corpus: Corpus;
}

export const TreedownComponent = (props: TreedownProps): ReactElement => {
  useDebug('TreedownComponent');

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  return (
    <div
      style={{
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '0.7rem',
        paddingRight: '0.7rem',
        color: cssVar('font-color', theme),
      }}
    >
      <p>Treedown!</p>
    </div>
  );
};

export default TreedownComponent;
