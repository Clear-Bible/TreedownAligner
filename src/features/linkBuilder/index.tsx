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
      state.textSegment.selectedTextSegments,
      (word: Word) => word.id.split('_')[0]
    )
  );

  console.log('selectedWords', selectedWords);

  const texts = useAppSelector((state) => state.polyglot.texts);

  return (
    <Fragment>
      {Object.keys(selectedWords).map((textId: string): ReactElement => {
        const text = texts.find((text: Text) => {
          return text.id === textId;
        });
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
              {selectedWords[textId]
                .sort((a: Word, b: Word) => {
                  return a.position > b.position ? 1 : -1;
                })
                .map((selectedWord): ReactElement => {
                  const word = text?.words.find((word: Word): boolean => {
                    return word.id === selectedWord.id;
                  });
                  return (
                    <span key={`selected_${selectedWord.id}`}>
                      {word?.text}{' '}
                    </span>
                  );
                })}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
};

export default LinkBuilderComponent;
