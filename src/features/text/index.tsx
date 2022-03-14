import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';
import TextSegment from 'features/textSegment';
import DragHandle from 'features/dragHandle';

import { Word, Corpus } from 'structs';

import cssVar from 'styles/cssVar';

interface TextProps {
  corpus: Corpus;
}

export const Text = (props: TextProps): ReactElement => {
  const { corpus } = props;
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
          fontWeight: 'regular',
          color: cssVar('font-color', theme),
        }}
      >
        {corpus.name}
      </div>
      <div
        style={{
          textAlign: 'right',
          padding: '0.5rem',
          marginTop: '-0.75rem',
          fontSize: 'small',
          fontVariant: 'small-caps',
          fontStyle: 'small-caps',
          color: cssVar('font-color', theme),
        }}
      >
        {corpus.fullName}
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
        {corpus.words.map((word: Word): ReactElement => {
          return <TextSegment key={word.id} word={word} />;
        })}
      </p>
      <DragHandle />
    </Fragment>
  );
};

export default Text;
