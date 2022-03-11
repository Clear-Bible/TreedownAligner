import { ReactElement, Fragment } from 'react';
import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';

import { Corpus, Word } from 'structs';
import findWordById from 'helpers/findWord';

import DragHandle from 'features/dragHandle';

import cssVar from 'styles/cssVar';

interface LinkBuilderProps {}

export const LinkBuilderComponent = (props: LinkBuilderProps): ReactElement => {
  useDebug('LinkBuilderComponent');

  const selectedWords: Record<string, Word[]> = useAppSelector((state) => {
    const inProgressLink = state.alignment.present.inProgressLink;

    if (inProgressLink) {
      const sourceWords: Word[] = inProgressLink.sources
        .map((sourceId) => findWordById(state.polyglot.corpora, sourceId))
        .filter((x): x is Word => x !== null);

      const targetWords: Word[] = inProgressLink.targets
        .map((targetId) => findWordById(state.polyglot.corpora, targetId))
        .filter((x): x is Word => x !== null);

      return {
        [inProgressLink.source]: sourceWords,
        [inProgressLink.target]: targetWords,
      };
    }

    return {};
  });

  const corpora = useAppSelector((state) => state.polyglot.corpora);

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

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
          <div
            style={{ lineHeight: '12rem', color: cssVar('font-color', theme) }}
          >
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
              color: cssVar('font-color', theme),
            }}
          >
            <div style={{ textAlign: 'right' }}>{corpus?.name}</div>
            <div>
              <hr />
            </div>
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
            <div>
              <hr />
            </div>
          </div>
        );
      })}
      <DragHandle />
    </Fragment>
  );
};

export default LinkBuilderComponent;
