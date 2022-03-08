import { ReactElement, Fragment } from 'react';
import { groupBy } from 'lodash';
import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';

import { Corpus, Word } from 'structs';

import DragHandle from 'features/dragHandle';

interface LinkBuilderProps {}

export const LinkBuilderComponent = (props: LinkBuilderProps): ReactElement => {
  useDebug('LinkBuilderComponent');

  const selectedWords: Record<string, Word[]> = useAppSelector((state) =>
    groupBy(
      state.alignment.present.selectedTextSegments,
      (word: Word) => word.id.split('_')[0]
    )
  );

  const corpora = useAppSelector((state) => state.polyglot.corpora);

  if (!Object.keys(selectedWords).length) {
    return (
      <Fragment>
        <div
          style={{
            textAlign: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
          }}
        >
          <div style={{ lineHeight: '12rem' }}>
            Select a word to begin building a link.
          </div>
        </div>
        <DragHandle />
      </Fragment>
    );
  }

  return (
    <Fragment>
      {Object.keys(selectedWords).map((textId: string): ReactElement => {
        const corpus = corpora.find((corpus: Corpus) => {
          return corpus.id === textId;
        });

        const selectedWordsForText = selectedWords[textId];
        const sortedSelectedWordsForText = selectedWordsForText.sort(
          (a: Word, b: Word) => {
            return a.position > b.position ? 1 : -1;
          }
        );

        return (
          <div
            key={`linkBuilder_${corpus?.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}
          >
            <div style={{ textAlign: 'right' }}>{corpus?.name}</div>
            <div>
              {sortedSelectedWordsForText.map((selectedWord): ReactElement => {
                const word = corpus?.words.find((word: Word): boolean => {
                  return word.id === selectedWord.id;
                });
                return (
                  <span key={`selected_${selectedWord.id}`}>{word?.text} </span>
                );
              })}
            </div>
          </div>
        );
      })}
      <DragHandle />
    </Fragment>
  );
};

export default LinkBuilderComponent;
