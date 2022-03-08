import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import TextSegment from 'features/textSegment';
import DragHandle from 'features/dragHandle';

import { Word } from 'structs';

interface TextProps {
  id: string;
  name: string;
  words: Word[];
}

export const Text = (props: TextProps): ReactElement => {
  useDebug('TextComponent');

  return (
    <Fragment>
      <div style={{ textAlign: 'right', padding: '0.5rem' }}>{props.name}</div>
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
          return (
            <TextSegment
              key={word.id}
              id={word.id}
              segment={word.text}
              textId={props.id}
            />
          );
        })}
      </p>
      <DragHandle />
    </Fragment>
  );
};

export default Text;
