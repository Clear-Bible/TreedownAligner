import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import TextSegment from 'features/textSegment';
import DragHandle from 'features/dragHandle';
import Treedown from 'features/treedown';

import { toggleCorpusView } from 'state/polyglot.slice';
import { Word, Corpus, CorpusViewType, Alignment } from 'structs';

import cssVar from 'styles/cssVar';

interface CorpusProps {
  corpus: Corpus;
}

const determineCorpusView = (corpus: Corpus) => {
  if (corpus.viewType === CorpusViewType.Paragraph) {
    return (
      <p
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        {corpus.words.map((word: Word): ReactElement => {
          return <TextSegment key={word.id} word={word} />;
        })}
      </p>
    );
  }

  if (corpus.viewType === CorpusViewType.Treedown) {
    return <Treedown corpus={corpus} />;
  }
};

export const CorpusComponent = (props: CorpusProps): ReactElement => {
  const { corpus } = props;
  useDebug('TextComponent');

  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  const isCorpusAligned = Boolean(
    useAppSelector((state) => {
      return state.alignment.present.alignments.find((alignment: Alignment) => {
        return alignment[corpus.role] === corpus.id;
      });
    })
  );

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

      {determineCorpusView(corpus)}

      <button
        disabled={!isCorpusAligned}
        style={{
          position: 'sticky',
          bottom: '0',
          cursor: 'pointer',
          height: '1rem',
          width: '1rem',
        }}
        onClick={() => {
          dispatch(toggleCorpusView(corpus.id));
        }}
      ></button>

      <DragHandle />
    </Fragment>
  );
};

export default CorpusComponent;
