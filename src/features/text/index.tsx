import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';
import TextSegment from 'features/textSegment';

import { Word } from 'structs';

interface TextProps {
  text: string;
  name: string;
  words: Word[];
}

export const Text = (props: TextProps): ReactElement => {
  useDebug('TextComponent');

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '0.5rem' }}>{props.name}</div>
      <p
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        {props.words.map((word: Word): ReactElement => {
          return <TextSegment key={word.id} id={word.id} segment={word.text} />;
        })}
      </p>
    </div>
  );
};

export default Text;
