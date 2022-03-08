import { ReactElement, Fragment } from 'react';
import { groupBy } from 'lodash';
import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';

import { Text, Word } from 'structs';

interface LinkBuilderProps {}

export const LinkBuilderComponent = (props: LinkBuilderProps): ReactElement => {
  useDebug('LinkBuilderComponent');

  const selectedWords: Record<string, Word[]> = useAppSelector((state) =>
    groupBy(
      state.textSegment.present.selectedTextSegments,
      (word: Word) => word.id.split('_')[0]
    )
  );

  const texts = useAppSelector((state) => state.polyglot.texts);

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
        <div
          className="drag-handle"
          style={{
            marginRight: '-1px',
            marginBottom: '-1px',
            position: 'absolute',
            bottom: '0',
            right: '0',
            cursor: 'grab',
            height: '0.7rem',
            width: '0.7rem',
            backgroundColor: 'black',
          }}
        ></div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {Object.keys(selectedWords).map((textId: string): ReactElement => {
        const text = texts.find((text: Text) => {
          return text.id === textId;
        });

        const selectedWordsForText = selectedWords[textId];
        const sortedSelectedWordsForText = selectedWordsForText.sort(
          (a: Word, b: Word) => {
            return a.position > b.position ? 1 : -1;
          }
        );

        return (
          <div
            key={`linkBuilder_${text?.name}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
            }}
          >
            <div style={{ textAlign: 'right' }}>{text?.name}</div>
            <div>
              {sortedSelectedWordsForText.map((selectedWord): ReactElement => {
                const word = text?.words.find((word: Word): boolean => {
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
      <div
        className="drag-handle"
        style={{
          marginRight: '-1px',
          marginBottom: '-1px',
          position: 'absolute',
          bottom: '0',
          right: '0',
          cursor: 'grab',
          height: '0.7rem',
          width: '0.7rem',
          backgroundColor: 'black',
        }}
      ></div>
    </Fragment>
  );
};

export default LinkBuilderComponent;
