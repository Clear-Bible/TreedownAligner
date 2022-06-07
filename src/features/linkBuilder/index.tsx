import { ReactElement } from 'react';
import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';
import { Divider, Typography } from '@mui/material';

import { Corpus, Word } from 'structs';
import findWordById from 'helpers/findWord';

import cssVar from 'styles/cssVar';

interface LinkBuilderProps {}

export const LinkBuilderComponent = (props: LinkBuilderProps): ReactElement => {
  useDebug('LinkBuilderComponent');

  const selectedWords: Record<string, Word[]> = useAppSelector((state) => {
    const inProgressLink = state.alignment.present.inProgressLink;

    if (inProgressLink) {
      const sourceWords: Word[] = inProgressLink.sources
        .map((sourceId) =>
          findWordById(state.alignment.present.corpora, sourceId)
        )
        .filter((x): x is Word => x !== null);

      const targetWords: Word[] = inProgressLink.targets
        .map((targetId) =>
          findWordById(state.alignment.present.corpora, targetId)
        )
        .filter((x): x is Word => x !== null);

      return {
        [inProgressLink.source]: sourceWords,
        [inProgressLink.target]: targetWords,
      };
    }

    return {};
  });

  const corpora = useAppSelector((state) => state.alignment.present.corpora);

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  if (!Object.keys(selectedWords).length) {
    return (
      <>
        <div
          style={{
            textAlign: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
          }}
        >
          <Typography
            style={{
              lineHeight: '12rem',
              color: cssVar('font-color', theme),
              userSelect: 'none',
            }}
          >
            Select a target word to begin building a link.
          </Typography>
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
    >
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
            <Typography variant="h6" style={{ textAlign: 'right' }}>
              {corpus?.name}
            </Typography>
            <div style={{ marginBottom: '8px' }}>
              <Divider />
            </div>
            <div>
              <span>&nbsp;</span>
              {sortedSelectedWordsForText.map(
                (selectedWord, index: number): ReactElement => {
                  const word = corpus?.words.find((word: Word): boolean => {
                    return word.id === selectedWord.id;
                  });

                  let nextIsSequential: boolean = true;
                  const next = sortedSelectedWordsForText[index + 1];
                  if (next) {
                    const sequenceDiff = next.position - selectedWord.position;
                    if (sequenceDiff > 1) {
                      nextIsSequential = false;
                    }
                  }
                  return (
                    <span key={`selected_${selectedWord.id}`}>
                      <span>{word?.text} </span>

                      {!nextIsSequential ? (
                        <span key={`selected_${selectedWord.id}_ellipsis`}>
                          ...{' '}
                        </span>
                      ) : null}
                    </span>
                  );
                }
              )}
            </div>
            <div style={{ marginTop: '8px' }}>
              <Divider />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LinkBuilderComponent;
