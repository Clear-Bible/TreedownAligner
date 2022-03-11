import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';
import TextSegment from 'features/textSegment';
import DragHandle from 'features/dragHandle';

import { Word } from 'structs';

import cssVar from 'styles/cssVar';

interface TextProps {
  id: string;
  name: string;
  words: Word[];
}

export const Text = (props: TextProps): ReactElement => {
  useDebug('TextComponent');

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  return (
    <Fragment>
      <div
        style={{
          textAlign: 'right',
          padding: '0.5rem',
          color: cssVar('font-color', theme),
        }}
      >
        {props.name}
      </div>
      <p
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
          userSelect: 'none',
        }}
      >
        {props.words.map((word: Word): ReactElement => {
          return <TextSegment key={word.id} word={word} />;
        })}
      </p>
      <DragHandle />
    </Fragment>
  );
};

export default Text;
